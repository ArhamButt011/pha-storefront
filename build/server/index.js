var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams, useLocation, NavLink, useNavigate, Link, Outlet as Outlet$1, useParams, useNavigation } from "react-router-dom";
import { createSlice, combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage/index.js";
import { ChevronDown, Search, ShoppingCart, User, Menu, X, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Send, CarFront, ShieldCheck, Truck, Headphones, PackageSearch, ChevronRight, Pencil, Check, Zap, ChevronLeft, ZoomOut, ZoomIn, Minimize, Maximize, Minus, Plus, PackageCheck, Trash2, Lock, ArrowLeft, Package, Home as Home$1, Building2, Loader2, BadgeCheck, Copy, Star, FileText, AlertTriangle, XCircle, Wrench, Printer, CreditCard } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import ReactSelect from "react-select";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
const STREAM_TIMEOUT_MS = 1e4;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        onShellReady() {
          shellRendered = true;
          responseHeaders.set("Content-Type", "text/html");
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) console.error(error);
        }
      }
    );
    setTimeout(abort, STREAM_TIMEOUT_MS);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const VEHICLE_PARAM_KEYS = ["make", "model", "model_code", "year_from", "year_to"];
function vehicleFromSearchParams(params) {
  const make = params.get("make") ?? "";
  if (!make) return null;
  return {
    make,
    model: params.get("model") ?? "",
    model_code: params.get("model_code") ?? "",
    year_from: params.get("year_from") ?? "",
    year_to: params.get("year_to") ?? ""
  };
}
function VehicleProvider({ children }) {
  return children;
}
function useVehicle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicle = useMemo(() => vehicleFromSearchParams(searchParams), [searchParams]);
  const setVehicle = useCallback(
    (next) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          VEHICLE_PARAM_KEYS.forEach((key) => params.delete(key));
          if (next == null ? void 0 : next.make) {
            params.set("make", next.make);
            if (next.model) params.set("model", next.model);
            if (next.model_code) params.set("model_code", next.model_code);
            if (next.year_from) params.set("year_from", next.year_from);
            if (next.year_to) params.set("year_to", next.year_to);
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );
  return { vehicle, setVehicle };
}
const initialState$1 = { items: [] };
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState$1,
  reducers: {
    addItem(state, action) {
      const quantity = action.payload.quantity ?? 1;
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, quantity });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action) {
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        return;
      }
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart(state) {
      state.items = [];
    }
  }
});
const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
const initialState = {
  orderId: null,
  guestToken: null,
  orderNumber: null,
  step: "shipping"
};
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setOrder(state, action) {
      state.orderId = action.payload.orderId;
      state.guestToken = action.payload.guestToken;
      state.orderNumber = action.payload.orderNumber;
      state.step = "payment";
    },
    resetCheckout() {
      return initialState;
    }
  }
});
const { setOrder, resetCheckout } = checkoutSlice.actions;
const checkoutReducer = checkoutSlice.reducer;
const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer
});
function createServerStore() {
  return configureStore({ reducer: rootReducer });
}
const persistConfig = {
  key: "pha-storefront",
  storage,
  // "checkout" is intentionally NOT persisted — it's a same-session cache
  // for the Shipping -> Payment handoff only (see checkoutSlice.ts), never
  // the source of truth for order/payment state.
  whitelist: ["cart"]
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
function buildBrowserStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  });
  return { store, persistor: null };
}
let browserStore;
function getBrowserStore() {
  if (!browserStore) browserStore = buildBrowserStore();
  return browserStore;
}
function startPersisting() {
  const { store } = getBrowserStore();
  if (!browserStore.persistor) {
    browserStore.persistor = persistStore(store);
  }
  return browserStore.persistor;
}
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("pha-theme");var d=s==="light"?false:s==="dark"?true:window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
function Layout$1({
  children
}) {
  return (
    // suppressHydrationWarning: the inline theme script above may mutate
    // this element's class attribute before React hydrates, which would
    // otherwise be flagged as a mismatch — this is the standard, documented
    // way to opt that one attribute out of hydration warnings (same pattern
    // as next-themes / the Remix Indie Stack).
    /* @__PURE__ */ jsxs("html", {
      lang: "en",
      className: "dark",
      suppressHydrationWarning: true,
      children: [/* @__PURE__ */ jsxs("head", {
        children: [/* @__PURE__ */ jsx("meta", {
          charSet: "UTF-8"
        }), /* @__PURE__ */ jsx("link", {
          rel: "icon",
          type: "image/svg+xml",
          href: "/branding/logo.svg"
        }), /* @__PURE__ */ jsx("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0"
        }), /* @__PURE__ */ jsx("title", {
          children: "Parts Hub Australia | Premium Automotive Parts"
        }), /* @__PURE__ */ jsx("meta", {
          name: "description",
          content: "Australia's #1 destination for premium automotive parts. Genuine parts, fast delivery, expert support."
        }), /* @__PURE__ */ jsx("link", {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        }), /* @__PURE__ */ jsx("link", {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: ""
        }), /* @__PURE__ */ jsx("link", {
          href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap",
          rel: "stylesheet"
        }), /* @__PURE__ */ jsx("script", {
          dangerouslySetInnerHTML: {
            __html: THEME_INIT_SCRIPT
          }
        }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
      }), /* @__PURE__ */ jsxs("body", {
        children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
      })]
    })
  );
}
const root = UNSAFE_withComponentProps(function App() {
  const [store] = useState(() => typeof document === "undefined" ? createServerStore() : getBrowserStore().store);
  useEffect(() => {
    startPersisting();
  }, []);
  return /* @__PURE__ */ jsxs(Provider, {
    store,
    children: [/* @__PURE__ */ jsx(ToastContainer, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "dark"
    }), /* @__PURE__ */ jsx(VehicleProvider, {
      children: /* @__PURE__ */ jsx(Outlet, {})
    })]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let status = 500;
  let message = "Something went wrong.";
  if (isRouteErrorResponse(error)) {
    const routeError = error;
    status = routeError.status;
    message = routeError.status === 404 ? "This page could not be found." : routeError.statusText || message;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-3 px-4 pt-32 text-center sm:px-6 lg:px-8",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "font-display text-3xl font-black text-fg",
      children: status
    }), /* @__PURE__ */ jsx("p", {
      className: "text-fg-muted",
      children: message
    }), false]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout: Layout$1,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const base = "relative inline-flex items-center justify-center overflow-hidden font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_hsl(var(--accent)/0.4)] shadow-soft",
  secondary: "bg-bg-2 text-fg border border-border hover:bg-bg-3 hover:border-accent/30",
  ghost: "bg-transparent text-fg hover:bg-bg-2",
  outline: "border border-border bg-transparent text-fg hover:border-accent/50 hover:bg-accent/5 hover:text-accent",
  danger: "bg-danger text-danger-fg hover:brightness-95"
};
const sizes = {
  sm: "h-9 rounded-full px-5 text-sm",
  md: "h-11 rounded-full px-7 text-sm",
  lg: "h-13 rounded-full px-9 text-base",
  icon: "h-10 w-10 rounded-full p-0"
};
function buttonClassName({
  variant = "primary",
  size = "md",
  className
}) {
  return cn(base, variants[variant], sizes[size], className);
}
const Button = React.forwardRef(
  function Button2({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        className: buttonClassName({ variant, size, className }),
        ...props
      }
    );
  }
);
function NavLinkItem({ href, label, onClick, className, activeClassName }) {
  const [basePath, hash] = href.split("#");
  const isHashLink = Boolean(hash);
  const { pathname } = useLocation();
  const [sectionInView, setSectionInView] = useState(false);
  useEffect(() => {
    if (!isHashLink) return;
    if (pathname !== (basePath || "/")) {
      setSectionInView(false);
      return;
    }
    const el = document.getElementById(hash);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry2]) => setSectionInView(entry2.isIntersecting),
      // Shrink the viewport box by the fixed navbar height on top, and
      // require the section to reach past the vertical midpoint before
      // counting as "in view" — standard scroll-spy behavior.
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHashLink, hash, basePath, pathname]);
  return /* @__PURE__ */ jsx(
    NavLink,
    {
      to: href,
      onClick,
      className: ({ isActive }) => {
        const active = isHashLink ? sectionInView : isActive;
        return cn(
          className,
          active && "nav-link-active",
          active && (activeClassName ?? "text-accent")
        );
      },
      children: label
    }
  );
}
function useCart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  function addToCart(item) {
    try {
      if (!item.id || !item.title) {
        throw new Error("Invalid item: missing id or title");
      }
      dispatch(addItem(item));
      toast.success(`${item.title} added to cart successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't add this item to your cart. Please try again.");
    }
  }
  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart: (id) => dispatch(removeItem(id)),
    setQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart())
  };
}
const tenantSlug = "parts-hub-australia";
const apiClient = axios.create({
  baseURL: "http://localhost:7001/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-Tenant-Slug": tenantSlug
  },
  timeout: 15e3
});
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    __publicField(this, "status");
    this.name = "ApiError";
    this.status = status;
  }
}
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    var _a, _b, _c;
    const message = ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) ?? err.message ?? "Something went wrong";
    return Promise.reject(new ApiError(message, (_c = err.response) == null ? void 0 : _c.status));
  }
);
const getCategories = async (params = {}) => {
  const { data } = await apiClient.get("/category", {
    params
  });
  return data;
};
const getCategory = async (id) => {
  const { data } = await apiClient.get(`/category/${id}`);
  return data;
};
const NAV_LINKS = [
  { label: "Shop by Category", href: "/categories" },
  { label: "Shop", href: "/shop" },
  // { label: "Popular Bundles", href: "/bundles" },
  { label: "About Us", href: "/#about" }
];
function Navbar({ onInquiry }) {
  var _a;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { setVehicle } = useVehicle();
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    setSearchQuery(urlSearchParams.get("search") ?? "");
  }, [urlSearchParams]);
  const selectedCategoryLabel = ((_a = categories.find((c) => c._id === searchCategory)) == null ? void 0 : _a.name) ?? "All Categories";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getCategories({ limit: 100, page: 1 });
        if (!cancelled) setCategories(res.data.items);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  function handleSearch() {
    setMenuOpen(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    const query = params.toString();
    const path = searchCategory ? `/shop/${searchCategory}` : "/shop";
    navigate(`${path}${query ? `?${query}` : ""}`);
  }
  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }
  function handleNavClick(href) {
    if (href === "/shop") setVehicle(null);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: `fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-bg/95 shadow-lg backdrop-blur-md border-b border-border" : "bg-transparent"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex shrink-0 items-center gap-0 group", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/branding/logo.svg",
                alt: "Parts Hub Australia",
                className: "h-16 w-16 object-contain transition-transform duration-300"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "hidden font-display text-sm font-bold tracking-wider text-fg sm:block", children: [
              "PARTS HUB ",
              /* @__PURE__ */ jsx("span", { className: "text-accent", children: "AUSTRALIA" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden items-center gap-6 lg:flex", children: NAV_LINKS.map((l) => /* @__PURE__ */ jsx(
            NavLinkItem,
            {
              href: l.href,
              label: l.label,
              onClick: () => handleNavClick(l.href),
              className: "nav-link whitespace-nowrap text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            },
            l.href
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden flex-1 items-center rounded-full border border-border bg-bg-2 py-1 pl-1 pr-1.5 lg:flex", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "category-autosize relative shrink-0",
                "data-label": selectedCategoryLabel,
                children: [
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: searchCategory,
                      onChange: (e) => setSearchCategory(e.target.value),
                      "aria-label": "Search category",
                      className: "min-w-[5.5rem] max-w-[12rem] rounded-full bg-bg-3 py-2 pl-3 pr-7 text-xs font-semibold text-fg-muted outline-none transition hover:text-fg focus:text-fg appearance-none",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "All Categories" }),
                        categories.map((c) => /* @__PURE__ */ jsx("option", { value: c._id, children: c.name }, c._id))
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "mx-2 h-5 w-px shrink-0 bg-border" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                onKeyDown: handleSearchKeyDown,
                placeholder: "Search part number…",
                className: "w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSearch,
                "aria-label": "Search",
                className: "ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition hover:brightness-110",
                children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ml-auto hidden items-center gap-1 lg:flex", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/cart", className: "relative p-2 text-fg-muted transition-colors hover:text-fg", "aria-label": "Cart", children: [
              /* @__PURE__ */ jsx(ShoppingCart, { className: "h-5 w-5" }),
              cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-fg", children: cartCount })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 text-fg-muted transition-colors hover:text-fg cursor-pointer",
                "aria-label": "Account",
                onClick: () => window.open("https://admin.partshubaustralia.com.au/login", "_blank"),
                children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "ml-auto p-2 text-fg lg:hidden",
              onClick: () => setMenuOpen(true),
              children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
            }
          )
        ] })
      }
    ),
    menuOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden",
        onClick: () => setMenuOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `mobile-menu fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-bg-2 p-8 lg:hidden ${menuOpen ? "open" : ""}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", onClick: () => setMenuOpen(false), children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "/branding/logo.svg",
                alt: "Parts Hub Australia",
                className: "h-10 w-10 object-contain"
              }
            ) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMenuOpen(false),
                className: "rounded-lg p-1.5 text-fg-muted hover:bg-bg-3 hover:text-fg",
                children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-2 rounded-xl border border-border bg-bg-3 p-2", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: searchCategory,
                onChange: (e) => setSearchCategory(e.target.value),
                "aria-label": "Search category",
                className: "w-full rounded-lg bg-bg-2 px-3 py-2 text-xs font-semibold text-fg-muted outline-none",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All Categories" }),
                  categories.map((c) => /* @__PURE__ */ jsx("option", { value: c._id, children: c.name }, c._id))
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  onKeyDown: handleSearchKeyDown,
                  placeholder: "Search part number…",
                  className: "w-full rounded-lg bg-bg-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-muted"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleSearch,
                  "aria-label": "Search",
                  className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg transition hover:brightness-110",
                  children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-1", children: NAV_LINKS.map((l) => /* @__PURE__ */ jsx(
            NavLinkItem,
            {
              href: l.href,
              label: l.label,
              onClick: () => {
                handleNavClick(l.href);
                setMenuOpen(false);
              },
              className: "rounded-lg px-4 py-3 text-base font-medium text-fg-muted transition-colors hover:bg-bg-3 hover:text-accent",
              activeClassName: "bg-bg-3 text-accent"
            },
            l.href
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full", onClick: () => {
              setMenuOpen(false);
              onInquiry();
            }, children: "Enquire" }),
            /* @__PURE__ */ jsx(Button, { className: "w-full", onClick: () => window.open("https://admin.partshubaustralia.com.au/login", "_blank"), children: "Sign In" })
          ] })
        ]
      }
    )
  ] });
}
const Input = React.forwardRef(
  function Input2({ className, ...props }, ref) {
    return /* @__PURE__ */ jsx(
      "input",
      {
        ref,
        className: cn(
          "w-full rounded-lg border border-border bg-bg-2 px-4 py-3 text-sm text-fg shadow-sm outline-none transition",
          "placeholder:text-fg-muted",
          "focus:border-accent/60 focus:ring-2 focus:ring-accent/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ...props
      }
    );
  }
);
const subscribeNewsletter = async (payload) => {
  const { data } = await apiClient.post(
    "/newsletter",
    payload
  );
  return data;
};
const CUSTOMER_SERVICE_LINKS = ["Returns Policy", "Shipping Info", "Track Order", "Warranty"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"];
function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await subscribeNewsletter({ email: email.trim() });
      toast.success(res.message || "Subscribed successfully.");
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't subscribe. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsx("footer", { id: "contact", className: "border-t border-border bg-bg pt-16 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 border-b border-border pb-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("img", { src: "/branding/logo.svg", alt: "Parts Hub Australia", className: "h-12 w-12 rounded-lg object-contain" }),
          /* @__PURE__ */ jsx("span", { className: "font-display text-base font-bold tracking-wider text-accent", children: "PARTS HUB" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm leading-relaxed text-fg-muted", children: "Australia's leading independent supplier of high-performance and genuine automotive components. Engineered for the enthusiast." }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "tel:0393575313", className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent", children: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("a", { href: "mailto:sales@partshubaustralia.com.au", className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent", children: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://maps.google.com/?q=34+Killara+Rd+Campbellfield+VIC+3061",
              target: "_blank",
              rel: "noreferrer",
              className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent",
              children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg", children: "Customer Service" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: CUSTOMER_SERVICE_LINKS.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-fg-muted transition-colors hover:text-accent", children: l }) }, l)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-5 font-display text-xs font-bold uppercase tracking-wider text-fg", children: "Legal & Privacy" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: LEGAL_LINKS.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-fg-muted transition-colors hover:text-accent", children: l }) }, l)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-2 font-display text-sm font-bold text-fg", children: "Subscribe to our newsletter" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-sm leading-relaxed text-fg-muted", children: "Get occasional product updates to your inbox." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubscribe, className: "flex overflow-hidden rounded-md border border-border", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "email",
              placeholder: "Your Email Address",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
              disabled: submitting,
              className: "rounded-none border-0 focus-visible:ring-0 bg-transparent"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "rounded-r-sm rounded-l-none w-20 transition-none hover:scale-100 hover:translate-y-0",
              "aria-label": "Subscribe",
              children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-fg-muted", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Parts Hub Australia. All rights reserved. Precision Engineered."
    ] }) })
  ] }) });
}
const Modal = DialogPrimitive.Root;
const ModalOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    ),
    ...props
  }
));
ModalOverlay.displayName = "ModalOverlay";
const ModalContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [
  /* @__PURE__ */ jsx(ModalOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
        "rounded-2xl border border-border bg-bg-2 p-8 shadow-2xl",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-lg p-2 text-fg-muted transition hover:bg-bg-3 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
ModalContent.displayName = "ModalContent";
const ModalHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("mb-6 flex flex-col gap-1.5", className), ...props });
const ModalTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("font-display text-xl font-bold tracking-wide text-fg", className),
    ...props
  }
));
ModalTitle.displayName = "ModalTitle";
const ModalDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-fg-muted", className),
    ...props
  }
));
ModalDescription.displayName = "ModalDescription";
const Textarea = React.forwardRef(
  function Textarea2({ className, ...props }, ref) {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        ref,
        className: cn(
          "w-full resize-y rounded-lg border border-border bg-bg-2 px-4 py-3 text-sm text-fg shadow-sm outline-none transition",
          "placeholder:text-fg-muted",
          "focus:border-accent/60 focus:ring-2 focus:ring-accent/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[120px]",
          className
        ),
        ...props
      }
    );
  }
);
const Select = React.memo(function Select2({
  value,
  onValueChange,
  placeholder = "Select...",
  disabled,
  options = [],
  className,
  maxMenuHeight = 240,
  // ~15rem, matches previous dropdown cap
  isSearchable = true
}) {
  const selected = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );
  return /* @__PURE__ */ jsx(
    ReactSelect,
    {
      value: selected,
      onChange: (opt) => onValueChange == null ? void 0 : onValueChange(opt ? opt.value : ""),
      options,
      placeholder,
      isDisabled: disabled,
      isSearchable,
      unstyled: true,
      menuPlacement: "auto",
      maxMenuHeight,
      classNamePrefix: "rs",
      className,
      classNames: {
        control: (state) => cn(
          "flex w-full items-center rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-sm text-fg transition",
          state.isFocused && "border-accent/60 ring-2 ring-accent/20",
          state.isDisabled && "cursor-not-allowed opacity-50"
        ),
        placeholder: () => "text-fg-muted",
        singleValue: () => "text-fg",
        input: () => "text-fg",
        indicatorSeparator: () => "hidden",
        dropdownIndicator: () => "text-fg-muted",
        menu: () => "z-50 mt-1 overflow-hidden rounded-lg border border-border bg-bg-2 shadow-lg",
        menuList: () => "p-1",
        option: (state) => cn(
          "cursor-pointer select-none rounded-md px-3 py-2 text-sm",
          state.isSelected && "font-semibold text-fg bg-accent/10",
          !state.isSelected && state.isFocused && "bg-accent/15 text-fg",
          !state.isSelected && !state.isFocused && "text-fg"
        ),
        noOptionsMessage: () => "px-3 py-2 text-sm text-fg-muted"
      }
    }
  );
});
const SUBJECTS = [
  "General Inquiry",
  "Parts Request",
  "Trade Account",
  "Warranty & Returns",
  "Bulk / Wholesale Order",
  "Other"
];
function InquiryModal({ open, onOpenChange }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${"http://localhost:7001/api/v1"}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || void 0,
          subject: form.subject,
          message: form.message
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data == null ? void 0 : data.message) || "Something went wrong. Please try again.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  function handleClose(o) {
    if (!o) {
      setTimeout(() => {
        setSent(false);
        setError(null);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }, 300);
    }
    onOpenChange(o);
  }
  return /* @__PURE__ */ jsx(Modal, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsx(ModalContent, { className: "max-w-md", children: sent ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 py-6 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-ok/15", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8 text-ok" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-fg", children: "Inquiry Sent!" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-fg-muted", children: "Thanks, we'll get back to you within 1 business day." })
    ] }),
    /* @__PURE__ */ jsx(Button, { onClick: () => handleClose(false), className: "mt-2", children: "Close" })
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(ModalHeader, { children: [
      /* @__PURE__ */ jsx(ModalTitle, { children: "Send an Inquiry" }),
      /* @__PURE__ */ jsx(ModalDescription, { children: "Fill in the form and our team will get back to you within 1 business day." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: [
            "Name ",
            /* @__PURE__ */ jsx("span", { className: "text-accent", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Your name",
              value: form.name,
              onChange: (e) => handleChange("name", e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Phone" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "(03) XXXX XXXX",
              value: form.phone,
              onChange: (e) => handleChange("phone", e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: [
          "Email ",
          /* @__PURE__ */ jsx("span", { className: "text-accent", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "email",
            placeholder: "you@example.com",
            value: form.email,
            onChange: (e) => handleChange("email", e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: [
          "Subject ",
          /* @__PURE__ */ jsx("span", { className: "text-accent", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Select,
          {
            value: form.subject,
            onValueChange: (v) => handleChange("subject", v),
            placeholder: "Select a subject…",
            options: SUBJECTS.map((s) => ({ value: s, label: s }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: [
          "Message ",
          /* @__PURE__ */ jsx("span", { className: "text-accent", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: "Tell us what you need…",
            value: form.message,
            onChange: (e) => handleChange("message", e.target.value),
            rows: 4,
            required: true
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-sm text-danger", children: error }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full gap-2", disabled: loading, children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-accent-fg/30 border-t-accent-fg" }),
        "Sending…"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
        "Send Inquiry"
      ] }) })
    ] })
  ] }) }) });
}
function Layout() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Navbar, {
      onInquiry: () => setInquiryOpen(true)
    }), /* @__PURE__ */ jsx(Outlet$1, {}), /* @__PURE__ */ jsx(Footer, {}), /* @__PURE__ */ jsx(InquiryModal, {
      open: inquiryOpen,
      onOpenChange: setInquiryOpen
    })]
  });
}
const Layout_default = UNSAFE_withComponentProps(Layout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: Layout_default
}, Symbol.toStringTag, { value: "Module" }));
function Hero() {
  const { setVehicle } = useVehicle();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "home",
      className: "relative flex min-h-[65vh] lg:min-h-[85vh] items-center overflow-hidden lg:pt-16 pt-0",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 z-0 bg-cover bg-center",
            style: { backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1200&fit=crop')" }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-t from-bg via-bg/80 to-bg/50" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-r from-bg via-bg/40 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent", children: "Premium Performance Excellence" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl font-black leading-tight text-fg sm:text-5xl lg:text-6xl", children: [
            "Australia's Trusted",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-accent glow-orange", children: "Automotive Parts" }),
            " Supplier"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/shop", onClick: () => setVehicle(null), children: [
            "Shop Parts",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
          ] }) }) })
        ] }) })
      ]
    }
  );
}
const getVehicleMakes = async () => {
  const { data } = await apiClient.get("/vehicle-model/makes");
  return data;
};
const getVehicleModels = async (make) => {
  const { data } = await apiClient.get("/vehicle-model/models", {
    params: { make }
  });
  return data;
};
const getVehicleModelCodes = async (make, model) => {
  const { data } = await apiClient.get("/vehicle-model/model-codes", {
    params: { make, model }
  });
  return data;
};
const getVehicleYears = async (make, model, model_code) => {
  const { data } = await apiClient.get("/vehicle-model/years", {
    params: { make, model, model_code }
  });
  return data;
};
const EMPTY = {
  make: "",
  model: "",
  model_code: "",
  year_from: "",
  year_to: ""
};
function VehicleSelector() {
  const { vehicle } = useVehicle();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(vehicle ?? EMPTY);
  useEffect(() => {
    setDraft(vehicle ?? EMPTY);
  }, [vehicle]);
  const { make, model, model_code, year_from } = draft;
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [modelCodes, setModelCodes] = useState([]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getVehicleMakes();
        if (!cancelled) setMakes(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!make) {
      setModels([]);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await getVehicleModels(make);
        if (!cancelled) setModels(res.data);
      } catch (err) {
        if (!cancelled) setModels([]);
        console.error(err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [make]);
  useEffect(() => {
    if (!make || !model) {
      setModelCodes([]);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await getVehicleModelCodes(make, model);
        if (!cancelled) setModelCodes(res.data);
      } catch (err) {
        if (!cancelled) setModelCodes([]);
        console.error(err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [make, model]);
  const makeOptions = useMemo(
    () => makes.map((m) => ({ value: m, label: m })),
    [makes]
  );
  const modelOptions = useMemo(
    () => models.map((m) => ({ value: m, label: m })),
    [models]
  );
  const modelCodeOptions = useMemo(
    () => modelCodes.map((c) => ({ value: c, label: c })),
    [modelCodes]
  );
  function update(patch) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }
  function handleMakeChange(nextMake) {
    update({ make: nextMake, model: "", model_code: "", year_from: "", year_to: "" });
  }
  function handleModelChange(nextModel) {
    update({ model: nextModel, model_code: "", year_from: "", year_to: "" });
  }
  async function handleModelCodeChange(nextModelCode) {
    update({ model_code: nextModelCode, year_from: "", year_to: "" });
    try {
      const res = await getVehicleYears(make, model, nextModelCode);
      update({
        model_code: nextModelCode,
        year_from: String(res.data.year_from),
        year_to: res.data.year_to != null ? String(res.data.year_to) : ""
      });
    } catch (err) {
      console.error(err);
    }
  }
  function handleFindParts() {
    const params = new URLSearchParams();
    if (draft.make) {
      params.set("make", draft.make);
      if (draft.model) params.set("model", draft.model);
      if (draft.model_code) params.set("model_code", draft.model_code);
      if (draft.year_from) params.set("year_from", draft.year_from);
      if (draft.year_to) params.set("year_to", draft.year_to);
    }
    navigate(draft.make ? `/shop?${params.toString()}` : "/shop");
  }
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "vehicle-selector",
      className: "relative z-20 -mt-16 mx-4 rounded-2xl border border-border bg-bg-2/95 px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md sm:mx-8 sm:px-8 sm:py-8 lg:mx-16",
      children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CarFront, { className: "h-5 w-5 text-accent" }),
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-fg", children: "Select Your Vehicle" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] lg:items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Make" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: make,
                onValueChange: handleMakeChange,
                placeholder: "Select Make",
                options: makeOptions
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Model" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: model,
                onValueChange: handleModelChange,
                placeholder: "Select Model",
                disabled: !make,
                options: modelOptions
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-1.5 lg:col-span-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Model Code" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: model_code,
                onValueChange: handleModelCodeChange,
                placeholder: "Select Code",
                disabled: !model,
                options: modelCodeOptions
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-1.5 lg:col-span-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Year" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: "1900",
                max: "2100",
                value: year_from,
                onChange: (e) => update({ year_from: e.target.value }),
                placeholder: "e.g. 2015"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "md", className: "col-span-2 gap-2 lg:col-span-1", onClick: handleFindParts, children: [
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
            "Find Parts"
          ] })
        ] })
      ] })
    }
  );
}
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry2]) => {
        if (entry2.isIntersecting) {
          entry2.target.classList.add("visible");
          observer.unobserve(entry2.target);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}
function CategoryCard({ category }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/shop/${category._id}`,
      className: "group overflow-hidden rounded-2xl border border-border bg-bg-2 transition-colors hover:border-accent/40",
      children: [
        /* @__PURE__ */ jsx("div", { className: "h-36 overflow-hidden", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: category.img,
            alt: category.name,
            className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "p-4 text-center", children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-fg", children: category.name }) })
      ]
    }
  );
}
function Categories({ categories }) {
  const headRef = useScrollReveal(0.2);
  const gridRef = useScrollReveal(0.1);
  return /* @__PURE__ */ jsx("section", { id: "categories", className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { ref: headRef, className: "reveal mb-10 flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent", children: "Browse Departments" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl", children: "Shop by Category" })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/categories", className: "flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5", children: [
        "View All Categories ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: gridRef,
        className: "stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5",
        children: categories.map((c) => /* @__PURE__ */ jsx(CategoryCard, { category: c }, c._id))
      }
    )
  ] }) });
}
const CATEGORIES = [
  {
    slug: "engine",
    title: "Engine",
    breadcrumbParent: "Performance",
    description: "Pistons, gaskets, timing components and full engine builds for maximum output and reliability.",
    img: "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=600&h=600&fit=crop"
  },
  {
    slug: "suspension",
    title: "Suspension Systems",
    breadcrumbParent: "Performance",
    description: "Precision-engineered suspension components designed for ultimate track performance and street comfort. Explore our curated range for your vehicle.",
    img: "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=600&h=600&fit=crop"
  },
  {
    slug: "turbo-systems",
    title: "Turbo Systems",
    breadcrumbParent: "Performance",
    description: "Turbochargers, intercoolers and boost hardware to unlock serious power gains.",
    img: "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=600&h=600&fit=crop"
  },
  {
    slug: "cooling",
    title: "Cooling",
    breadcrumbParent: "Performance",
    description: "Radiators, fans and oil coolers that keep your build running at its best under load.",
    img: "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=600&h=600&fit=crop"
  },
  {
    slug: "brakes",
    title: "Brakes",
    breadcrumbParent: "Performance",
    description: "Pads, rotors, calipers and full big-brake kits engineered for repeatable stopping power.",
    img: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=600&h=600&fit=crop"
  },
  {
    slug: "electrical",
    title: "Electrical",
    breadcrumbParent: "Performance",
    description: "Batteries, alternators, starters and wiring components for a dependable electrical system.",
    img: "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&h=600&fit=crop"
  },
  {
    slug: "exhaust",
    title: "Exhaust Systems",
    breadcrumbParent: "Performance",
    description: "Cat-back systems, headers and mufflers engineered for flow, sound and weight savings.",
    img: "https://images.unsplash.com/photo-1692309175422-b9d614f4764e?w=600&h=600&fit=crop"
  },
  {
    slug: "drivetrain",
    title: "Drivetrain",
    breadcrumbParent: "Performance",
    description: "Clutches, differentials and driveshafts built to handle everything your engine can throw at them.",
    img: "https://images.unsplash.com/photo-1725916631373-23184b9b9170?w=600&h=600&fit=crop"
  },
  {
    slug: "wheels-tyres",
    title: "Wheels & Tyres",
    breadcrumbParent: "Performance",
    description: "Forged wheels and performance rubber to put the power down with confidence.",
    img: "https://images.unsplash.com/photo-1614689304159-273632ab5c5a?w=600&h=600&fit=crop"
  },
  {
    slug: "lighting",
    title: "Lighting",
    breadcrumbParent: "Performance",
    description: "LED, HID and driving lights for better visibility and a sharper look.",
    img: "https://images.unsplash.com/photo-1608412217711-ab7d42cf7920?w=600&h=600&fit=crop"
  },
  {
    slug: "interior",
    title: "Interior Accessories",
    breadcrumbParent: "Performance",
    description: "Gauges, pedals and trim upgrades that sharpen the cabin experience.",
    img: "https://images.unsplash.com/photo-1611099711902-1228419f7113?w=600&h=600&fit=crop"
  },
  {
    slug: "body-exterior",
    title: "Body & Exterior",
    breadcrumbParent: "Performance",
    description: "Splitters, bumpers and aero components engineered for form and function.",
    img: "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=600&h=600&fit=crop"
  }
];
function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}
function productToCartItem(product, quantity) {
  var _a;
  const categoryLabel = product.categoryName ?? ((_a = getCategoryBySlug(product.categorySlug)) == null ? void 0 : _a.title);
  const meta2 = product.fitmentConfirmedFor ? `Vehicle: ${product.fitmentConfirmedFor} | ${product.partType}` : product.partType;
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    img: product.img,
    price: product.price,
    quantity,
    category: categoryLabel,
    meta: meta2,
    shippingNote: product.stock.label
  };
}
function ProductCard$1({ product }) {
  const { addToCart } = useCart();
  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productToCartItem(product));
  }
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/product/${product.slug}`,
      className: "product-card group flex flex-col overflow-hidden rounded-2xl bg-bg-2",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-44 overflow-hidden shine", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: product.img,
              alt: product.title,
              className: "card-img h-full w-full object-cover",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleAdd,
              className: "absolute bottom-3 left-3 flex -translate-x-[calc(100%+0.75rem)] items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-fg opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100",
              children: [
                /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }),
                "Add to Cart"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-[11px] font-semibold uppercase tracking-wider text-fg-muted", children: product.make }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 line-clamp-2 text-sm font-bold text-fg", children: product.title }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-2 pt-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-base font-black text-accent", children: [
              "A$",
              product.price.toLocaleString()
            ] }),
            product.oldPrice && /* @__PURE__ */ jsxs("span", { className: "text-xs text-fg-muted/60 line-through", children: [
              "A$",
              product.oldPrice.toLocaleString()
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Products({ products }) {
  const headRef = useScrollReveal(0.2);
  const gridRef = useScrollReveal(0.1);
  const { setVehicle } = useVehicle();
  return /* @__PURE__ */ jsx("section", { id: "products", className: "bg-bg-2/40 py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { ref: headRef, className: "reveal mb-10 flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent", children: "Precision Engineered" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl", children: "Featured Parts" })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/shop", onClick: () => setVehicle(null), className: "flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5", children: [
        "Explore Shop ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: gridRef,
        className: "stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5",
        children: products.map((p) => /* @__PURE__ */ jsx(ProductCard$1, { product: p }, p.id))
      }
    )
  ] }) });
}
const REASONS = [
  {
    icon: ShieldCheck,
    title: "Genuine Parts",
    desc: "We source directly from manufacturers to ensure 100% authenticity and perfect fitment every time."
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Expedited dispatch from our Melbourne and Sydney hubs to all corners of Australia and NZ."
  },
  {
    icon: Headphones,
    title: "Expert Advice",
    desc: "Our team of automotive technicians is ready to help you find the exact part for your specific build."
  }
];
function WhyChooseUs() {
  const headRef = useScrollReveal(0.2);
  const gridRef = useScrollReveal(0.1);
  return /* @__PURE__ */ jsx("section", { id: "about", className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { ref: headRef, className: "reveal mb-14 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent", children: "Precision, Delivered." }),
      /* @__PURE__ */ jsx("h2", { className: "mx-auto mt-2 max-w-2xl font-display text-2xl font-black tracking-wide text-fg sm:text-3xl", children: "We are more than just a shop; we are automotive enthusiasts dedicated to providing the highest quality parts across Australia." })
    ] }),
    /* @__PURE__ */ jsx("div", { ref: gridRef, className: "stagger grid gap-8 sm:grid-cols-3", children: REASONS.map((r) => {
      const Icon = r.icon;
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-base font-bold text-fg", children: r.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xs text-sm leading-relaxed text-fg-muted", children: r.desc })
      ] }, r.title);
    }) })
  ] }) });
}
const STATS = [
  { value: "98%", label: "On-Time Delivery" },
  { value: "2-Day", label: "Average Transit" }
];
function LogisticsStats() {
  const textRef = useScrollReveal(0.2);
  const mapRef = useScrollReveal(0.15);
  return /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-10 lg:grid-cols-2 lg:gap-16", children: [
    /* @__PURE__ */ jsxs("div", { ref: textRef, className: "reveal", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-accent", children: "National Network" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl", children: "Australia-Wide Logistical Excellence" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-fg-muted", children: "Strategically located distribution hubs allow us to reach 90% of Australia within 48 hours. Our real-time tracking and animated route mapping ensure you're always in the loop." }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-2 gap-4", children: STATS.map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-bg-2 px-4 py-5", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display text-3xl font-black text-accent", children: s.value }),
        /* @__PURE__ */ jsx("div", { className: "mt-1.5 text-xs font-medium uppercase tracking-wider text-fg-muted", children: s.label })
      ] }, s.label)) }),
      /* @__PURE__ */ jsxs(Button, { size: "lg", className: "mt-8 gap-2", children: [
        /* @__PURE__ */ jsx(PackageSearch, { className: "h-5 w-5" }),
        "Track Your Order"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { ref: mapRef, className: "reveal", children: /* @__PURE__ */ jsx("div", { className: "grid-bg relative flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-border bg-bg-3 sm:h-96", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxs("span", { className: "relative flex h-3 w-3", children: [
        /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" }),
        /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-3 w-3 rounded-full bg-accent" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "mt-2 flex items-center gap-1 rounded-full bg-bg/90 px-2.5 py-1 text-[11px] font-semibold text-fg shadow-soft", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 text-accent" }),
        " Melbourne Hub"
      ] })
    ] }) }) })
  ] }) }) });
}
const getProducts = async (params = {}) => {
  const { data } = await apiClient.get(
    "/product",
    { params }
  );
  return data;
};
const getProductBySlug = async (slug) => {
  const { data } = await apiClient.get(
    `/product/${slug}`
  );
  return data;
};
const CATEGORY_IMAGE_BY_SLUG = {
  engine: "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=600&h=600&fit=crop",
  suspension: "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=600&h=600&fit=crop",
  "turbo-systems": "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=600&h=600&fit=crop",
  cooling: "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=600&h=600&fit=crop",
  brakes: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=600&h=600&fit=crop",
  electrical: "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&h=600&fit=crop",
  exhaust: "https://images.unsplash.com/photo-1692309175422-b9d614f4764e?w=600&h=600&fit=crop",
  drivetrain: "https://images.unsplash.com/photo-1725916631373-23184b9b9170?w=600&h=600&fit=crop",
  "wheels-tyres": "https://images.unsplash.com/photo-1614689304159-273632ab5c5a?w=600&h=600&fit=crop",
  lighting: "https://images.unsplash.com/photo-1608412217711-ab7d42cf7920?w=600&h=600&fit=crop",
  interior: "https://images.unsplash.com/photo-1611099711902-1228419f7113?w=600&h=600&fit=crop",
  "body-exterior": "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=600&h=600&fit=crop"
};
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1692309175422-b9d614f4764e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1725916631373-23184b9b9170?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1614689304159-273632ab5c5a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1608412217711-ab7d42cf7920?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611099711902-1228419f7113?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=600&h=600&fit=crop"
];
function getCategoryImage(slug, index) {
  return CATEGORY_IMAGE_BY_SLUG[slug] ?? DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
}
const STOCK_DOT = {
  "in-stock": "bg-ok",
  limited: "bg-accent",
  "out-of-stock": "bg-danger"
};
function mapApiStockStatus(status) {
  if (status === "low_stock") return "limited";
  if (status === "out_of_stock") return "out-of-stock";
  return "in-stock";
}
function stockLabel(status, count) {
  if (status === "out-of-stock") return "Out of Stock";
  if (status === "limited") return count ? `Low Stock (${count} left)` : "Low Stock";
  return "In Stock";
}
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=500&h=500&fit=crop";
function formatYearRange(yearFrom, yearTo) {
  if (yearFrom && yearTo) return yearFrom === yearTo ? `${yearFrom}` : `${yearFrom} – ${yearTo}`;
  if (yearFrom) return `${yearFrom} – Present`;
  if (yearTo) return `Up to ${yearTo}`;
  return "—";
}
function fitmentToRow(f) {
  return {
    make: f.make || "—",
    model: f.model || "—",
    series: f.model_code || "—",
    yearRange: formatYearRange(f.year_from, f.year_to)
  };
}
function buildListingSpecs(item) {
  var _a;
  const listing = (_a = item.listings) == null ? void 0 : _a[0];
  if (!listing) return [];
  const specs = [];
  if (listing.superseded_part_number.length > 0) {
    specs.push({ label: "Superseded Part Number(s)", value: listing.superseded_part_number.join(", ") });
  }
  for (const [label, value] of Object.entries(listing.aspects)) {
    if (value) specs.push({ label, value });
  }
  return specs;
}
function mapApiProductToProduct(item) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const hasDiscount = item.compare_price != null && item.compare_price > item.price;
  const primaryCategory = (_a = item.categories) == null ? void 0 : _a[0];
  const display = item.display;
  const galleryImages = item.attachments && item.attachments.length > 0 ? item.attachments.map((a) => a.url) : [PLACEHOLDER_IMG];
  return {
    id: item._id,
    categorySlug: (primaryCategory == null ? void 0 : primaryCategory.slug) ?? "",
    slug: item.slug,
    categoryName: primaryCategory == null ? void 0 : primaryCategory.name,
    brand: item.brand ?? "Generic",
    partType: ((_b = item.tags) == null ? void 0 : _b[0]) ?? (primaryCategory == null ? void 0 : primaryCategory.name) ?? "Part",
    title: item.title,
    img: galleryImages[0],
    gallery: galleryImages,
    rating: 0,
    price: item.price,
    oldPrice: hasDiscount ? item.compare_price : void 0,
    badge: hasDiscount ? "sale" : void 0,
    stock: (() => {
      const status = mapApiStockStatus(item.stock_status);
      return { status, label: stockLabel(status, item.stock_count) };
    })(),
    fits: ((_c = item.vehicle) == null ? void 0 : _c.make) ? [item.vehicle.make] : "all",
    make: ((_d = item.vehicle) == null ? void 0 : _d.make) ?? null,
    model: ((_e = item.vehicle) == null ? void 0 : _e.model) ?? null,
    model_code: ((_f = item.vehicle) == null ? void 0 : _f.model_code) ?? null,
    year_from: ((_g = item.vehicle) == null ? void 0 : _g.year_from) ?? null,
    year_to: ((_h = item.vehicle) == null ? void 0 : _h.year_to) ?? null,
    vehicleFit: item.vehicle ?? null,
    sku: item.sku ?? void 0,
    // `display` is the backend's already-resolved precedence (listing
    // override wins, else the product's own value) — rendered as-is rather
    // than re-derived here. Title/description/price/photo overrides are
    // deliberately excluded from `display` server-side: those are meant for
    // that specific marketplace's listing page, not the storefront (the
    // description override in particular is a full HTML page template, not
    // plain text fit for this display).
    condition: (display == null ? void 0 : display.condition) ?? item.condition ?? void 0,
    conditionNotes: (display == null ? void 0 : display.condition_notes) ?? void 0,
    authenticity: (display == null ? void 0 : display.authenticity) ?? item.authenticity ?? void 0,
    warranty: (display == null ? void 0 : display.warranty) ?? void 0,
    productNote: item.description || void 0,
    vehicleFitments: ((display == null ? void 0 : display.vehicle_fitments) ?? []).map(fitmentToRow),
    specs: buildListingSpecs(item)
  };
}
function getOrigin(request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}
function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
function stripHtml(input) {
  return input.replace(/<[^>]*>/g, "").trim();
}
function mapAvailability(stockStatus) {
  return stockStatus === "out_of_stock" ? "OutOfStock" : "InStock";
}
function mapItemCondition(condition) {
  const normalized = (condition ?? "").toLowerCase();
  if (normalized.includes("refurb")) return "RefurbishedCondition";
  if (normalized.includes("used")) return "UsedCondition";
  if (normalized.includes("damage")) return "DamagedCondition";
  return "NewCondition";
}
const FEATURED_COUNT = 5;
async function loader$3({
  request
}) {
  const [categoriesRes, productsRes] = await Promise.all([getCategories({
    limit: FEATURED_COUNT,
    page: 1
  }), getProducts({
    page: 1,
    limit: FEATURED_COUNT
  })]);
  const featuredCategories = categoriesRes.data.items.map((cat, index) => ({
    ...cat,
    img: getCategoryImage(cat.slug, index)
  }));
  return {
    featuredCategories,
    featuredProducts: productsRes.data.items.map(mapApiProductToProduct),
    origin: getOrigin(request)
  };
}
function meta$4({
  data
}) {
  const title = "Parts Hub Australia | Premium Automotive Parts";
  const description = "Australia's #1 destination for premium automotive parts. Genuine parts, fast delivery, expert support.";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, ...data ? [{
    property: "og:url",
    content: data.origin
  }] : []];
}
const Home = UNSAFE_withComponentProps(function Home2({
  loaderData
}) {
  const {
    hash
  } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    el == null ? void 0 : el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [hash]);
  return /* @__PURE__ */ jsxs("main", {
    children: [/* @__PURE__ */ jsx(Hero, {}), /* @__PURE__ */ jsx(VehicleSelector, {}), /* @__PURE__ */ jsx(Categories, {
      categories: loaderData.featuredCategories
    }), /* @__PURE__ */ jsx(Products, {
      products: loaderData.featuredProducts
    }), /* @__PURE__ */ jsx(WhyChooseUs, {}), /* @__PURE__ */ jsx(LogisticsStats, {})]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home,
  loader: loader$3,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function Breadcrumb({ items }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "flex flex-wrap items-center gap-1.5 text-sm text-fg-muted", children: items.map((item, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
    i > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 text-fg-muted/60" }),
    item.href ? /* @__PURE__ */ jsx(Link, { to: item.href, className: "transition-colors hover:text-accent", children: item.label }) : /* @__PURE__ */ jsx("span", { className: "text-fg", children: item.label })
  ] }, i)) });
}
const SEARCH_DEBOUNCE_MS = 400;
async function loader$2({
  request
}) {
  const res = await getCategories({
    limit: 100,
    page: 1
  });
  const categories = res.data.items.map((cat, index) => ({
    ...cat,
    img: getCategoryImage(cat.slug, index)
  }));
  return {
    categories,
    origin: getOrigin(request)
  };
}
function meta$3({
  data
}) {
  const canonicalUrl = data ? `${data.origin}/categories` : void 0;
  return [{
    title: "Shop by Category | Parts Hub Australia"
  }, {
    name: "description",
    content: "Browse automotive parts by category — engine, suspension, brakes, exhaust and more, all fitted to your vehicle."
  }, ...canonicalUrl ? [{
    property: "og:title",
    content: "Shop by Category | Parts Hub Australia"
  }, {
    property: "og:url",
    content: canonicalUrl
  }] : []];
}
const CategoriesGrid = UNSAFE_withComponentProps(function CategoriesGrid2({
  loaderData
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [categories, setCategories] = useState(loaderData.categories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const skipNextFetch = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCategories({
          limit: 100,
          page: 1,
          search: debouncedQuery || void 0
        });
        if (cancelled) return;
        const withImages = res.data.items.map((cat, index) => ({
          ...cat,
          img: getCategoryImage(cat.slug, index)
        }));
        setCategories(withImages);
      } catch (err) {
        if (!cancelled) setError("Failed to load categories. Please try again.");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8",
    children: [/* @__PURE__ */ jsx("div", {
      className: "mb-6",
      children: /* @__PURE__ */ jsx(Breadcrumb, {
        items: [{
          label: "Home",
          href: "/"
        }, {
          label: "Shop by Category"
        }]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "rounded-2xl border border-border bg-bg-2 p-6 sm:p-8",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-display text-3xl font-black tracking-wide text-fg sm:text-4xl",
        children: "Shop by Category"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-3 max-w-2xl text-fg-muted",
        children: "Precision engineering across every system on your vehicle. Select a category to find compatible high-performance parts."
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative mt-6 max-w-md",
        children: [/* @__PURE__ */ jsx(Search, {
          className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
        }), /* @__PURE__ */ jsx(Input, {
          placeholder: "Search categories…",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          className: "pl-11"
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-10",
      children: loading ? /* @__PURE__ */ jsx("div", {
        className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
        children: "Loading categories…"
      }) : error ? /* @__PURE__ */ jsx("div", {
        className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
        children: error
      }) : categories.length > 0 ? /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4",
        children: categories.map((c) => /* @__PURE__ */ jsx(CategoryCard, {
          category: c
        }, c._id))
      }) : /* @__PURE__ */ jsxs("div", {
        className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
        children: ['No categories match "', debouncedQuery, '".']
      })
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CategoriesGrid,
  loader: loader$2,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function VehicleChip({ vehicle }) {
  const { setVehicle } = useVehicle();
  const label = [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-3 rounded-full border border-border bg-bg-2 py-1.5 pl-3 pr-1.5", children: [
    /* @__PURE__ */ jsx(CarFront, { className: "h-4 w-4 text-accent" }),
    /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider text-fg-muted", children: "Your Vehicle" }),
      /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-fg", children: label })
    ] }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/#vehicle-selector",
        className: "flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-3 hover:text-accent",
        "aria-label": "Change vehicle",
        children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setVehicle(null),
        className: "flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-3 hover:text-red-400",
        "aria-label": "Clear vehicle filter",
        children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
const Checkbox = React.forwardRef(
  function Checkbox2({ className, ...props }, ref) {
    return /* @__PURE__ */ jsxs("span", { className: "relative inline-flex h-4 w-4 shrink-0 items-center justify-center", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref,
          type: "checkbox",
          className: cn(
            "peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-xs border border-border bg-bg-2 transition",
            "checked:border-accent checked:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          ),
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Check, { className: "pointer-events-none absolute h-3 w-3 text-accent-fg opacity-0 peer-checked:opacity-100" })
    ] });
  }
);
const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" }
];
function FilterSidebar({
  partTypes,
  selectedPartTypeIds,
  onTogglePartType,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  stock,
  onStockChange,
  onClearAll,
  vehicleFitmentLabel
}) {
  return /* @__PURE__ */ jsx("aside", { className: "w-full shrink-0 lg:w-64", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold uppercase tracking-wider text-fg", children: "Filters" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClearAll, className: "text-xs font-semibold text-accent hover:underline", children: "Clear All" })
    ] }),
    partTypes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-5 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted", children: "Part Type" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: partTypes.map((t) => /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center justify-between gap-2 text-sm text-fg-muted transition-colors hover:text-fg", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Checkbox, { checked: selectedPartTypeIds.includes(t.id), onChange: () => onTogglePartType(t.id) }),
          t.name
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-fg-muted", children: [
          "(",
          t.count,
          ")"
        ] })
      ] }, t.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted", children: "Price Range" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            inputMode: "numeric",
            placeholder: "A$ Min",
            value: priceMin,
            onChange: (e) => onPriceMinChange(e.target.value),
            className: "px-3 py-2 text-sm"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs text-fg-muted", children: "to" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            inputMode: "numeric",
            placeholder: "A$ Max",
            value: priceMax,
            onChange: (e) => onPriceMaxChange(e.target.value),
            className: "px-3 py-2 text-sm"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted", children: "Stock" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: STOCK_OPTIONS.map((opt) => /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: stock === opt.value,
            onChange: () => onStockChange(stock === opt.value ? null : opt.value)
          }
        ),
        opt.label
      ] }, opt.value)) })
    ] }),
    vehicleFitmentLabel && /* @__PURE__ */ jsxs("div", { className: "mt-5 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted", children: "Vehicle Fitment" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent", children: [
        /* @__PURE__ */ jsx(CarFront, { className: "h-3.5 w-3.5 shrink-0" }),
        "Filtered for ",
        vehicleFitmentLabel
      ] })
    ] })
  ] }) });
}
const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrival" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" }
];
function ResultsHeader({ count, sort, onSortChange }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-fg-muted", children: [
      "Showing ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: count }),
      " Performance Parts"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-fg-muted", children: "Sort By:" }),
      /* @__PURE__ */ jsx(
        Select,
        {
          value: sort,
          onValueChange: onSortChange,
          options: SORT_OPTIONS,
          className: "w-48",
          isSearchable: false
        }
      )
    ] })
  ] });
}
const BADGE_LABEL = {
  "top-rated": "Top Rated",
  sale: "Sale"
};
const BADGE_CLASS = {
  "top-rated": "bg-accent text-accent-fg",
  sale: "bg-danger text-danger-fg"
};
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const outOfStock = product.stock.status === "out-of-stock";
  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(productToCartItem(product));
  }
  function handleBuyNow(e) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(productToCartItem(product));
    navigate("/checkout");
  }
  return /* @__PURE__ */ jsxs(Link, { to: `/product/${product.slug}`, className: "product-card flex flex-col overflow-hidden rounded-2xl bg-bg-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden shine", children: [
      /* @__PURE__ */ jsx("img", { src: product.img, alt: product.title, className: "card-img h-full w-full object-cover", loading: "lazy" }),
      product.badge && /* @__PURE__ */ jsx("span", { className: cn("absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide", BADGE_CLASS[product.badge]), children: BADGE_LABEL[product.badge] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-1.5 flex items-center justify-between gap-2", children: /* @__PURE__ */ jsx("span", { className: "truncate text-xs font-semibold uppercase tracking-wider text-fg-muted", children: product.make }) }),
      /* @__PURE__ */ jsx("h3", { className: "mb-4 font-bold text-fg", children: product.title }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xl font-black text-accent", children: [
            "A$",
            product.price.toLocaleString()
          ] }),
          product.oldPrice && /* @__PURE__ */ jsxs("span", { className: "text-sm text-fg-muted/60 line-through", children: [
            "A$",
            product.oldPrice.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleAdd,
              disabled: outOfStock,
              title: "Add to Cart",
              className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
              children: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleBuyNow,
              disabled: outOfStock,
              title: "Buy Now",
              className: "flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg transition-all hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50",
              children: /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-fg-muted", children: [
        /* @__PURE__ */ jsx("span", { className: cn("h-1.5 w-1.5 shrink-0 rounded-full", STOCK_DOT[product.stock.status]) }),
        product.stock.label
      ] })
    ] })
  ] });
}
function getPageList(current, total) {
  const siblings = [];
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    siblings.push(i);
  }
  const pages = [1];
  if (siblings[0] > 2) pages.push("ellipsis");
  pages.push(...siblings);
  if (siblings[siblings.length - 1] < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);
  return pages;
}
function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;
  const pages = getPageList(page, totalPages);
  return /* @__PURE__ */ jsxs("nav", { className: cn("flex items-center justify-center gap-2", className), "aria-label": "Pagination", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        disabled: page <= 1,
        onClick: () => onPageChange(page - 1),
        className: "flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-accent/40 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",
        "aria-label": "Previous page",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
      }
    ),
    pages.map(
      (p, i) => p === "ellipsis" ? /* @__PURE__ */ jsx("span", { className: "px-1 text-sm text-fg-muted", children: "…" }, `ellipsis-${i}`) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onPageChange(p),
          "aria-current": p === page ? "page" : void 0,
          className: cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            p === page ? "bg-accent text-accent-fg" : "text-fg-muted hover:bg-bg-2 hover:text-fg"
          ),
          children: p
        },
        p
      )
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        disabled: page >= totalPages,
        onClick: () => onPageChange(page + 1),
        className: "flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-accent/40 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",
        "aria-label": "Next page",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      }
    )
  ] });
}
const SHOP_FILTER_PARAMS = {
  categories: "categories",
  priceMin: "price_min",
  priceMax: "price_max",
  sort: "sort",
  page: "page",
  stock: "stock",
  search: "search"
};
const DEFAULT_SORT = "newest";
const P = SHOP_FILTER_PARAMS;
function useShopFilters(routeCategoryId) {
  var _a;
  const [searchParams, setSearchParams] = useSearchParams();
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (routeCategoryId && !searchParams.has(P.categories)) {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set(P.categories, routeCategoryId);
          return params;
        },
        { replace: true }
      );
    }
  }, [routeCategoryId]);
  const categoryIds = searchParams.getAll(P.categories);
  const priceMin = searchParams.get(P.priceMin) ?? "";
  const priceMax = searchParams.get(P.priceMax) ?? "";
  const sort = searchParams.get(P.sort) ?? DEFAULT_SORT;
  const page = Math.max(1, Number(searchParams.get(P.page) ?? "1") || 1);
  const stock = searchParams.get(P.stock) ?? null;
  const search = ((_a = searchParams.get(P.search)) == null ? void 0 : _a.trim()) ?? "";
  function updateFilters(mutate) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        mutate(params);
        params.delete(P.page);
        return params;
      },
      { replace: true }
    );
  }
  function toggleCategory(id) {
    updateFilters((params) => {
      const current = params.getAll(P.categories);
      params.delete(P.categories);
      const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
      next.forEach((c) => params.append(P.categories, c));
    });
  }
  function setPriceMin(value) {
    updateFilters((params) => value ? params.set(P.priceMin, value) : params.delete(P.priceMin));
  }
  function setPriceMax(value) {
    updateFilters((params) => value ? params.set(P.priceMax, value) : params.delete(P.priceMax));
  }
  function setSort(value) {
    updateFilters(
      (params) => value === DEFAULT_SORT ? params.delete(P.sort) : params.set(P.sort, value)
    );
  }
  function setStock(value) {
    updateFilters((params) => value ? params.set(P.stock, value) : params.delete(P.stock));
  }
  function setPage(nextPage) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (nextPage <= 1) params.delete(P.page);
        else params.set(P.page, String(nextPage));
        return params;
      },
      { replace: true }
    );
  }
  function clearAll() {
    updateFilters((params) => {
      params.delete(P.categories);
      params.delete(P.priceMin);
      params.delete(P.priceMax);
      params.delete(P.stock);
    });
  }
  return {
    categoryIds,
    priceMin,
    priceMax,
    sort,
    page,
    stock,
    search,
    toggleCategory,
    setPriceMin,
    setPriceMax,
    setSort,
    setPage,
    setStock,
    clearAll
  };
}
const PAGE_SIZE = 9;
function mapSortToApiParam(sort) {
  switch (sort) {
    case "price-asc":
      return "price_low_high";
    case "price-desc":
      return "price_high_low";
    default:
      return void 0;
  }
}
async function loader$1({
  request,
  params
}) {
  var _a;
  const url = new URL(request.url);
  const sp = url.searchParams;
  const P2 = SHOP_FILTER_PARAMS;
  const categoryIds = sp.getAll(P2.categories);
  if (categoryIds.length === 0 && params.categoryId) categoryIds.push(params.categoryId);
  const priceMin = sp.get(P2.priceMin) ?? "";
  const priceMax = sp.get(P2.priceMax) ?? "";
  const sort = sp.get(P2.sort) ?? DEFAULT_SORT;
  const page = Math.max(1, Number(sp.get(P2.page) ?? "1") || 1);
  const stock = sp.get(P2.stock) ?? void 0;
  const search = ((_a = sp.get(P2.search)) == null ? void 0 : _a.trim()) || void 0;
  const make = sp.get("make") || void 0;
  const model = sp.get("model") || void 0;
  const model_code = sp.get("model_code") || void 0;
  const year_from = sp.get("year_from") || void 0;
  const origin = getOrigin(request);
  try {
    const [categoryRes, productsRes, partTypesRes] = await Promise.all([params.categoryId ? getCategory(params.categoryId) : Promise.resolve(null), getProducts({
      page,
      limit: PAGE_SIZE,
      categories: categoryIds.length ? categoryIds.join(",") : void 0,
      search,
      price_min: priceMin ? Number(priceMin) : void 0,
      price_max: priceMax ? Number(priceMax) : void 0,
      sort: mapSortToApiParam(sort),
      stock,
      make,
      model,
      model_code,
      year: year_from
    }), getCategories({
      limit: 100
    })]);
    return {
      category: (categoryRes == null ? void 0 : categoryRes.data) ?? null,
      products: productsRes.data.items,
      total: productsRes.data.total,
      totalPages: Math.max(1, productsRes.data.totalPages),
      partTypes: partTypesRes.data.items.map((c) => ({
        id: c._id,
        name: c.name,
        count: c.product_count ?? 0
      })),
      origin,
      error: null
    };
  } catch (err) {
    console.error(err);
    return {
      category: null,
      products: [],
      total: 0,
      totalPages: 1,
      partTypes: [],
      origin,
      error: "Failed to load products. Please try again."
    };
  }
}
function meta$2({
  data
}) {
  if (!data) return [];
  const title = data.category ? `${data.category.name} | Parts Hub Australia` : "Shop All Parts | Parts Hub Australia";
  const description = data.category ? `Browse our full range of ${data.category.name.toLowerCase()} parts for your vehicle.` : "Browse our full range of performance parts for your vehicle.";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:url",
    content: `${data.origin}/shop`
  }];
}
const ProductsListing = UNSAFE_withComponentProps(function ProductsListing2({
  loaderData
}) {
  const {
    categoryId
  } = useParams();
  const filters = useShopFilters(categoryId);
  const {
    vehicle
  } = useVehicle();
  const navigation = useNavigation();
  const loading = navigation.state !== "idle";
  const category = loaderData.category;
  const partTypes = loaderData.partTypes;
  const categoryProducts = loaderData.products.map(mapApiProductToProduct);
  const total = loaderData.total;
  const totalPages = loaderData.totalPages;
  const [priceMinInput, setPriceMinInput] = useState(filters.priceMin);
  const [priceMaxInput, setPriceMaxInput] = useState(filters.priceMax);
  const PRICE_DEBOUNCE_MS = 400;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (priceMinInput !== filters.priceMin) filters.setPriceMin(priceMinInput);
    }, PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [priceMinInput]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (priceMaxInput !== filters.priceMax) filters.setPriceMax(priceMaxInput);
    }, PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [priceMaxInput]);
  function clearAll() {
    setPriceMinInput("");
    setPriceMaxInput("");
    filters.clearAll();
  }
  const title = filters.search ? `Search results for "${filters.search}"` : (category == null ? void 0 : category.name) ?? "All Parts";
  const description = filters.search ? `Showing parts matching "${filters.search}"${category ? ` in ${category.name}` : ""}.` : category ? `Browse our full range of ${category.name.toLowerCase()} parts for your vehicle.` : "Browse our full range of performance parts for your vehicle.";
  const breadcrumbItems = category ? [{
    label: "Home",
    href: "/"
  }, {
    label: "Categories",
    href: "/categories"
  }, {
    label: category.name
  }] : [{
    label: "Home",
    href: "/"
  }, {
    label: filters.search ? "Search Results" : "All Parts"
  }];
  const vehicleLabel = (vehicle == null ? void 0 : vehicle.make) ? [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ") : void 0;
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto max-w-7xl px-4 pb-8 lg:pt-28 pt-20 sm:px-6 lg:px-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "mb-6 flex flex-wrap items-center justify-between gap-4",
      children: [/* @__PURE__ */ jsx(Breadcrumb, {
        items: breadcrumbItems
      }), (vehicle == null ? void 0 : vehicle.make) && /* @__PURE__ */ jsx(VehicleChip, {
        vehicle
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-8",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-display text-3xl font-black tracking-wide text-fg sm:text-4xl",
        children: title
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-2 max-w-2xl text-fg-muted",
        children: description
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col gap-8 lg:flex-row",
      children: [/* @__PURE__ */ jsx(FilterSidebar, {
        partTypes,
        selectedPartTypeIds: filters.categoryIds,
        onTogglePartType: filters.toggleCategory,
        priceMin: priceMinInput,
        priceMax: priceMaxInput,
        onPriceMinChange: setPriceMinInput,
        onPriceMaxChange: setPriceMaxInput,
        stock: filters.stock,
        onStockChange: filters.setStock,
        onClearAll: clearAll,
        vehicleFitmentLabel: vehicleLabel
      }), /* @__PURE__ */ jsxs("div", {
        className: "min-w-0 flex-1",
        children: [/* @__PURE__ */ jsx(ResultsHeader, {
          count: total,
          sort: filters.sort,
          onSortChange: filters.setSort
        }), loading ? /* @__PURE__ */ jsx("div", {
          className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
          children: "Loading parts…"
        }) : loaderData.error ? /* @__PURE__ */ jsx("div", {
          className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
          children: loaderData.error
        }) : categoryProducts.length > 0 ? /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
          children: categoryProducts.map((p) => /* @__PURE__ */ jsx(ProductCard, {
            product: p
          }, p.id))
        }) : /* @__PURE__ */ jsx("div", {
          className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
          children: "No parts match your current filters."
        }), /* @__PURE__ */ jsx(Pagination, {
          page: filters.page,
          totalPages,
          onPageChange: filters.setPage,
          className: "mt-10"
        })]
      })]
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductsListing,
  loader: loader$1,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function useFullscreen(ref) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === ref.current);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      if (document.fullscreenElement === ref.current) {
        document.exitFullscreen().catch(() => {
        });
      }
    };
  }, [ref]);
  const toggle = useCallback(async () => {
    if (!ref.current) return;
    if (document.fullscreenElement === ref.current) {
      await document.exitFullscreen();
    } else {
      await ref.current.requestFullscreen();
    }
  }, [ref]);
  return { isFullscreen, toggle };
}
function useImageZoom(scale = 2.5) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const toggle = useCallback(() => setIsZoomed((z) => !z), []);
  const reset = useCallback(() => setIsZoomed(false), []);
  const handleMouseMove = useCallback(
    (e) => {
      if (!isZoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: (e.clientX - rect.left) / rect.width * 100,
        y: (e.clientY - rect.top) / rect.height * 100
      });
    },
    [isZoomed]
  );
  const style = isZoomed ? { transform: `scale(${scale})`, transformOrigin: `${origin.x}% ${origin.y}%` } : void 0;
  return { isZoomed, toggle, reset, handleMouseMove, style };
}
function LightboxHeader({
  current,
  total,
  isZoomed,
  onToggleZoom,
  isFullscreen,
  onToggleFullscreen,
  onClose
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 text-sm text-white/70", children: [
    /* @__PURE__ */ jsxs("span", { children: [
      current,
      " / ",
      total
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleZoom,
          className: "hover:text-white",
          "aria-label": isZoomed ? "Zoom out" : "Zoom in",
          "aria-pressed": isZoomed,
          children: isZoomed ? /* @__PURE__ */ jsx(ZoomOut, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(ZoomIn, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleFullscreen,
          className: "hover:text-white hidden sm:block",
          "aria-label": isFullscreen ? "Exit fullscreen" : "Fullscreen",
          "aria-pressed": isFullscreen,
          children: isFullscreen ? /* @__PURE__ */ jsx(Minimize, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Maximize, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "hover:text-white", "aria-label": "Close", children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) })
    ] })
  ] });
}
function LightboxImage({ src, alt, isZoomed, style, onToggleZoom, onMouseMove }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative inline-flex max-h-full max-w-full overflow-hidden rounded-lg",
      onClick: onToggleZoom,
      onMouseMove,
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt,
          style,
          className: `max-h-full max-w-full object-contain transition-transform duration-150 ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`
        }
      )
    }
  );
}
function LightboxNavButton({ direction, onClick }) {
  const isPrev = direction === "prev";
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      className: `absolute top-1/2 -translate-y-1/2 rounded-full p-2 text-white/60 hover:text-white ${isPrev ? "left-2 sm:left-6" : "right-2 sm:right-6"}`,
      "aria-label": isPrev ? "Previous image" : "Next image",
      children: isPrev ? /* @__PURE__ */ jsx(ChevronLeft, { className: "h-8 w-8" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-8 w-8" })
    }
  );
}
function ImageLightbox({ images, activeIndex, alt, onClose, onNavigate }) {
  const containerRef = useRef(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);
  const { isZoomed, toggle: toggleZoom, reset: resetZoom, handleMouseMove, style: zoomStyle } = useImageZoom();
  const goPrev = useCallback(() => {
    onNavigate(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }, [activeIndex, images.length, onNavigate]);
  const goNext = useCallback(() => {
    onNavigate(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, images.length, onNavigate]);
  useEffect(() => {
    resetZoom();
  }, [activeIndex, resetZoom]);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "fixed inset-0 z-[100] flex flex-col bg-black/95", children: [
    /* @__PURE__ */ jsx(
      LightboxHeader,
      {
        current: activeIndex + 1,
        total: images.length,
        isZoomed,
        onToggleZoom: toggleZoom,
        isFullscreen,
        onToggleFullscreen: toggleFullscreen,
        onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-1 items-center justify-center px-4 pb-4 overflow-hidden", children: [
      images.length > 1 && /* @__PURE__ */ jsx(LightboxNavButton, { direction: "prev", onClick: goPrev }),
      /* @__PURE__ */ jsx(
        LightboxImage,
        {
          src: images[activeIndex],
          alt,
          isZoomed,
          style: zoomStyle,
          onToggleZoom: toggleZoom,
          onMouseMove: handleMouseMove
        }
      ),
      images.length > 1 && /* @__PURE__ */ jsx(LightboxNavButton, { direction: "next", onClick: goNext })
    ] }),
    alt && /* @__PURE__ */ jsx("p", { className: "pb-4 text-center text-sm text-white/60", children: alt })
  ] });
}
function ImageGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
    images.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex w-20 shrink-0 flex-col gap-3", children: images.map((img, i) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setActive(i),
        className: cn(
          "aspect-square overflow-hidden rounded-xl border-2 bg-bg-2 transition-colors",
          i === active ? "border-accent" : "border-transparent hover:border-border"
        ),
        children: /* @__PURE__ */ jsx("img", { src: img, alt: "", className: "h-full w-full object-contain", loading: "lazy" })
      },
      img
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 aspect-square overflow-hidden rounded-2xl bg-bg-2", children: [
      /* @__PURE__ */ jsx("img", { src: images[active], alt, className: "h-full w-full object-contain" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setLightboxOpen(true),
          className: "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/80 text-fg backdrop-blur transition-colors hover:bg-bg",
          "aria-label": "Open full image view",
          children: /* @__PURE__ */ jsx(ZoomIn, { className: "h-4 w-4" })
        }
      )
    ] }),
    lightboxOpen && /* @__PURE__ */ jsx(
      ImageLightbox,
      {
        images,
        activeIndex: active,
        alt,
        onClose: () => setLightboxOpen(false),
        onNavigate: setActive
      }
    )
  ] });
}
function FitmentBadge({ vehicleLabel }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3", children: [
    /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 shrink-0 text-accent" }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-accent", children: "Guaranteed Fitment" }),
      " ",
      /* @__PURE__ */ jsxs("span", { className: "text-fg-muted", children: [
        "Confirmed for your: ",
        vehicleLabel
      ] })
    ] })
  ] });
}
function SpecCell({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-fg-muted", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-fg", children: value })
  ] });
}
function TechnicalSpecifications({ product }) {
  const rows = [
    [
      { label: "Make", value: product.make ?? product.brand },
      { label: "Model", value: product.model ?? "—" }
    ],
    [
      { label: "Series", value: product.model_code ?? "—" },
      {
        label: "Year",
        value: product.year_from && product.year_to ? product.year_from === product.year_to ? `${product.year_from}` : `${product.year_from} – ${product.year_to}` : product.year_from ? `${product.year_from} – Present` : "—"
      }
    ],
    [
      { label: "Authenticity", value: product.authenticity ?? "Genuine" },
      { label: "Condition", value: product.condition ?? "New" }
    ]
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-fg", children: "Technical Specifications" }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 h-0.5 w-10 bg-accent" }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "divide-y divide-border rounded-2xl border border-border bg-bg-2 px-5", children: [
      rows.map(([left, right], i) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx(SpecCell, { ...left }),
        /* @__PURE__ */ jsx(SpecCell, { ...right })
      ] }, i)),
      product.productNote && /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-fg-muted", children: "Product Note" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm italic leading-relaxed text-fg-muted", children: product.productNote })
      ] }),
      product.conditionNotes && /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-fg-muted", children: "Condition Notes" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-fg-muted", children: product.conditionNotes })
      ] }),
      product.specs && product.specs.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6 py-4", children: product.specs.map((spec) => /* @__PURE__ */ jsx(SpecCell, { ...spec }, spec.label)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-4", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 shrink-0 text-accent" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-fg-muted", children: "Warranty · " }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: product.warranty ?? "12 Months · Australia Cover" })
        ] })
      ] })
    ] }) })
  ] });
}
function VehicleFitmentTable({ fitments }) {
  if (fitments.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mt-12", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-fg", children: "Vehicle Fitment" }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 h-0.5 w-10 bg-accent" }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-x-auto rounded-2xl border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[520px] text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border bg-bg-2", children: ["Make", "Model", "Series", "Year Range"].map((h) => /* @__PURE__ */ jsx(
        "th",
        {
          className: "px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-accent",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsx("tbody", { children: fitments.map((row, i) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border last:border-0 even:bg-bg-2/40", children: [
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-medium text-fg", children: row.make }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-fg-muted", children: row.model }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-mono text-xs text-fg-muted", children: row.series }),
        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-fg-muted", children: row.yearRange })
      ] }, i)) })
    ] }) })
  ] });
}
function ProductTabs({ product }) {
  const note = product.engineeringNote;
  const features = product.features;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(TechnicalSpecifications, { product }),
    (note || features && features.length > 0) && /* @__PURE__ */ jsxs("div", { className: "mt-12", children: [
      note && /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-fg-muted", children: note }),
      features && features.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3", children: features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-fg-muted", children: [
        /* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }),
        f
      ] }, f)) })
    ] }),
    /* @__PURE__ */ jsx(VehicleFitmentTable, { fitments: product.vehicleFitments ?? [] })
  ] });
}
function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center rounded-full border border-border bg-bg-2", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(Math.max(min, value - 1)),
        className: "flex h-11 w-11 items-center justify-center text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",
        disabled: value <= min,
        "aria-label": "Decrease quantity",
        children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "w-8 text-center text-sm font-semibold text-fg", children: value }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(Math.min(max, value + 1)),
        className: "flex h-11 w-11 items-center justify-center text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",
        disabled: value >= max,
        "aria-label": "Increase quantity",
        children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
      }
    )
  ] });
}
function buildProductJsonLd(product, origin) {
  var _a, _b, _c;
  const canonicalUrl = `${origin}/product/${product.slug}`;
  const mpn = ((_a = product.display) == null ? void 0 : _a.mpn) ?? product.mpn ?? null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtml(product.description) || product.title,
    ...((_b = product.attachments) == null ? void 0 : _b.length) ? {
      image: product.attachments.map((a) => a.url)
    } : {},
    ...product.sku ? {
      sku: product.sku
    } : {},
    // Omitted entirely when the backend has no brand for this product —
    // the feed never fabricates one either (resolveIdentifiers only sends
    // brand alongside a present mpn; a fabricated "Generic" here would
    // itself be a page/feed mismatch of the kind this migration needs to
    // avoid, even though the on-page *display* still shows "Generic" via
    // mapApiProductToProduct's own, pre-existing fallback).
    ...product.brand ? {
      brand: {
        "@type": "Brand",
        name: product.brand
      }
    } : {},
    offers: {
      "@type": "Offer",
      // Straight from the backend response — never rounded/reformatted, so
      // this can never drift from the Merchant Center feed for the same SKU.
      price: String(product.price),
      priceCurrency: "AUD",
      availability: `https://schema.org/${mapAvailability(product.stock_status)}`,
      itemCondition: `https://schema.org/${mapItemCondition(((_c = product.display) == null ? void 0 : _c.condition) ?? product.condition)}`,
      url: canonicalUrl,
      ...mpn ? {
        mpn
      } : {}
    }
  };
}
async function loader({
  params,
  request
}) {
  const {
    slug
  } = params;
  try {
    const res = await getProductBySlug(slug);
    return {
      product: res.data,
      origin: getOrigin(request)
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      throw new Response("Not Found", {
        status: 404
      });
    }
    throw err;
  }
}
function meta$1({
  data
}) {
  var _a, _b;
  if (!data) return [];
  const {
    product,
    origin
  } = data;
  const canonicalUrl = `${origin}/product/${product.slug}`;
  const title = `${product.title} | Parts Hub Australia`;
  const description = stripHtml(product.description).slice(0, 300) || product.title;
  const image = (_b = (_a = product.attachments) == null ? void 0 : _a[0]) == null ? void 0 : _b.url;
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:type",
    content: "product"
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:url",
    content: canonicalUrl
  }, ...image ? [{
    property: "og:image",
    content: image
  }] : []];
}
const ProductDetails = UNSAFE_withComponentProps(function ProductDetails2({
  loaderData
}) {
  const navigate = useNavigate();
  const {
    addToCart
  } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const product = mapApiProductToProduct(loaderData.product);
  const jsonLd = buildProductJsonLd(loaderData.product, loaderData.origin);
  const category = getCategoryBySlug(product.categorySlug);
  const gallery = product.gallery ?? [product.img];
  const infoRows = [product.sku ? {
    label: "SKU #",
    value: product.sku
  } : null, product.material ? {
    label: "Material",
    value: product.material
  } : null].filter((row) => row !== null);
  function handleAddToCart() {
    if (product.stock.status === "out-of-stock") return;
    try {
      addToCart(productToCartItem(product, qty));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    }
  }
  function handleBuyNow() {
    if (product.stock.status === "out-of-stock") return;
    try {
      addToCart(productToCartItem(product, qty));
      navigate("/checkout");
    } catch (err) {
      console.error(err);
    }
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-28 sm:px-6 lg:px-8",
    children: [/* @__PURE__ */ jsx("link", {
      rel: "canonical",
      href: `${loaderData.origin}/product/${loaderData.product.slug}`
    }), /* @__PURE__ */ jsx("script", {
      type: "application/ld+json",
      dangerouslySetInnerHTML: {
        __html: safeJsonLd(jsonLd)
      }
    }), /* @__PURE__ */ jsx("div", {
      className: "mb-6",
      children: /* @__PURE__ */ jsx(Breadcrumb, {
        items: [{
          label: "Home",
          href: "/"
        }, ...category ? [{
          label: category.title,
          href: `/shop/${category.slug}`
        }] : [{
          label: "All Parts",
          href: "/shop"
        }], {
          label: product.title
        }]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid gap-10 md:grid-cols-2",
      children: [/* @__PURE__ */ jsx(ImageGallery, {
        images: gallery,
        alt: product.title
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex flex-wrap items-center justify-between gap-2",
          children: product.grade && /* @__PURE__ */ jsx("span", {
            className: "rounded-full bg-bg-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-muted",
            children: product.grade
          })
        }), /* @__PURE__ */ jsx("h1", {
          className: "mt-3 font-display text-2xl font-black leading-tight text-fg sm:text-3xl",
          children: product.title
        }), product.shortDescription && /* @__PURE__ */ jsx("p", {
          className: "mt-3 text-fg-muted",
          children: product.shortDescription
        }), product.fitmentConfirmedFor && /* @__PURE__ */ jsx("div", {
          className: "mt-5",
          children: /* @__PURE__ */ jsx(FitmentBadge, {
            vehicleLabel: product.fitmentConfirmedFor
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6 flex flex-wrap items-baseline gap-3",
          children: [/* @__PURE__ */ jsxs("span", {
            className: "text-3xl font-black text-accent",
            children: ["A$", product.price.toLocaleString(), ".00"]
          }), product.oldPrice && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("span", {
              className: "text-base text-fg-muted/60 line-through",
              children: ["A$", product.oldPrice.toLocaleString(), ".00"]
            }), /* @__PURE__ */ jsxs("span", {
              className: "rounded-full bg-ok/15 px-2.5 py-1 text-xs font-bold text-ok",
              children: ["Save $", (product.oldPrice - product.price).toLocaleString(), ".00"]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-5 space-y-2 text-sm text-fg-muted",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Truck, {
              className: "h-4 w-4 shrink-0 text-accent"
            }), " Fast Dispatch from Melbourne HQ"]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(PackageCheck, {
              className: "h-4 w-4 shrink-0 text-accent"
            }), " ", product.stock.label]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-4 flex flex-col gap-3 sm:flex-row",
          children: [/* @__PURE__ */ jsx(QuantityStepper, {
            value: qty,
            onChange: setQty
          }), /* @__PURE__ */ jsx(Button, {
            className: "mt-2 w-full gap-2",
            onClick: handleAddToCart,
            size: "lg",
            disabled: product.stock.status === "out-of-stock",
            children: product.stock.status === "out-of-stock" ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"
          })]
        }), /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          size: "lg",
          className: "mt-3 w-full gap-2",
          onClick: handleBuyNow,
          disabled: product.stock.status === "out-of-stock",
          children: [/* @__PURE__ */ jsx(Zap, {
            className: "h-4 w-4"
          }), "Buy Now"]
        }), infoRows.length > 0 && /* @__PURE__ */ jsx("div", {
          className: "mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6 text-sm",
          children: infoRows.map((row) => /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between gap-2",
            children: [/* @__PURE__ */ jsx("span", {
              className: "text-fg-muted",
              children: row.label
            }), /* @__PURE__ */ jsx("span", {
              className: "font-semibold text-fg",
              children: row.value
            })]
          }, row.label))
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-16",
      children: /* @__PURE__ */ jsx(ProductTabs, {
        product
      })
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductDetails,
  loader,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
Array.from({ length: 15 }, (_, i) => `${2026 - i}`);
const MODELS_BY_MAKE = {
  BMW: ["3 Series", "5 Series", "M3", "M4", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "AMG GT", "GLE"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
  Porsche: ["911", "Cayenne", "Macan", "Taycan"]
};
const MAKES = Object.keys(MODELS_BY_MAKE);
const VEHICLE_OPTIONS = MAKES.flatMap((make) => MODELS_BY_MAKE[make].map((model) => `${make} ${model}`));
function BundlesHero({ vehicleValue, onVehicleChange, onFilter }) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-bg-2 p-6 sm:p-8", children: [
    /* @__PURE__ */ jsx("span", { className: "inline-block rounded-full bg-bg-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-muted", children: "Pre-Configured Kits" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-3xl font-black tracking-wide text-fg sm:text-4xl", children: "Engineered Efficiency" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-fg-muted", children: "Unlock maximum performance and value with our curated Popular Bundles. Expertly selected parts designed to work in perfect harmony, saving you time and money." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row sm:items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 sm:max-w-xs sm:flex-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Year/Make/Model" }),
        /* @__PURE__ */ jsx(
          Select,
          {
            value: vehicleValue,
            onValueChange: onVehicleChange,
            placeholder: "Select Vehicle",
            options: VEHICLE_OPTIONS.map((v) => ({ value: v, label: v }))
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: onFilter, className: "shrink-0 uppercase tracking-wide", children: "Filter Bundles" })
    ] })
  ] });
}
function formatPrice(value) {
  return `A$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function BundleCard({ bundle }) {
  const saveAmount = bundle.oldPrice - bundle.price;
  return /* @__PURE__ */ jsxs("div", { className: "product-card flex flex-col overflow-hidden rounded-2xl bg-bg-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden shine", children: [
      /* @__PURE__ */ jsx("img", { src: bundle.img, alt: bundle.title, className: "card-img h-full w-full object-cover", loading: "lazy" }),
      /* @__PURE__ */ jsxs("span", { className: "absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-fg", children: [
        "Save ",
        formatPrice(saveAmount)
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white", children: [
        "Fitment: ",
        bundle.fitmentLabel
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-fg", children: bundle.title }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: bundle.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-bg-3 px-2.5 py-1 text-[11px] font-medium text-fg-muted", children: tag }, tag)) }),
      /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-1.5", children: bundle.includes.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-xs text-fg-muted", children: [
        /* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" }),
        item
      ] }, item)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between pt-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-fg-muted/60 line-through", children: formatPrice(bundle.oldPrice) }),
          /* @__PURE__ */ jsx("span", { className: "text-xl font-black text-accent", children: formatPrice(bundle.price) })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-all hover:brightness-110", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }) })
      ] })
    ] })
  ] });
}
function WhyChooseBundles() {
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4 lg:flex-row lg:items-stretch", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative min-h-64 flex-1 overflow-hidden rounded-2xl", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://images.unsplash.com/photo-1777903586357-23398a0b0a87?w=900&h=1000&fit=crop",
          alt: "Engine bay",
          className: "absolute inset-0 h-full w-full object-cover",
          loading: "lazy"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-white", children: "Why Choose Bundles?" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-white/70", children: "Our kits are curated by mechanics and engineers to ensure every essential fix and upgrade is accounted for. No more mid-job hardware store runs. Just pure performance out of the box." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 rounded-2xl border border-border bg-bg-2 p-5", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold uppercase tracking-wider text-accent", children: "Guaranteed Fitment" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-fg-muted", children: "Enter your VIN and we guarantee the bundle will fit your vehicle or we'll swap it for free." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
          /* @__PURE__ */ jsx("div", { className: "font-display text-2xl font-black text-accent", children: "15%" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-fg-muted", children: "Average Bundle Savings compared to individual parts." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
          /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5 text-accent" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-fg-muted", children: "Free Express Shipping on all bundles over $500." })
        ] })
      ] })
    ] })
  ] });
}
const BUNDLES = [
  {
    id: "ultimate-brake-refresh-kit",
    title: "Ultimate Brake Refresh Kit",
    img: "https://images.unsplash.com/photo-1774902410486-648614277f1f?w=600&h=600&fit=crop",
    fitmentLabel: "BMW G80/G82",
    fits: ["BMW"],
    tags: ["Carbon-Ceramic Pads", "Grilled Rotors", "Braided Lines"],
    includes: [
      "2x Front Slotted Performance Rotors",
      "Front & Rear Brake Pad Set (Street/Track)",
      "2L Performance Dot 4 Brake Fluid"
    ],
    price: 1250,
    oldPrice: 1495
  },
  {
    id: "complete-oil-service-bundle",
    title: "Complete Oil Service Bundle",
    img: "https://images.unsplash.com/photo-1590227763209-821c686b932f?w=600&h=600&fit=crop",
    fitmentLabel: "BMW Motors",
    fits: ["BMW"],
    tags: ["0W-20 Full Synth", "OEM Filter"],
    includes: [
      "7L Ravenol Synthetic Oil",
      "Magnetic Drain Plug Replacement",
      "High-Flow Oil Filter Cartridge"
    ],
    price: 168,
    oldPrice: 210
  },
  {
    id: "suspension-overhaul-pack",
    title: "Suspension Overhaul Pack",
    img: "https://images.unsplash.com/photo-1729545321223-e597f91a25d9?w=600&h=600&fit=crop",
    fitmentLabel: "Universal Multi-Line",
    fits: "all",
    tags: ["Track-Ready", "Poly Bushings"],
    includes: [
      "Adjustable Front & Rear Coilovers",
      "Complete Polyurethane Bushing Set",
      "Front Upper Control Arms"
    ],
    price: 3270,
    oldPrice: 3850
  }
];
function meta({}) {
  const title = "Popular Bundles | Parts Hub Australia";
  const description = "Curated performance part bundles for popular makes — built to fit together, priced to bundle.";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }];
}
const BundlesListing = UNSAFE_withComponentProps(function BundlesListing2() {
  const [vehicleValue, setVehicleValue] = useState("");
  const [appliedMake, setAppliedMake] = useState(null);
  function handleFilter() {
    const make = MAKES.find((m) => vehicleValue.startsWith(m));
    setAppliedMake(make ?? null);
  }
  const bundles = useMemo(() => {
    if (!appliedMake) return BUNDLES;
    return BUNDLES.filter((b) => b.fits === "all" || b.fits.includes(appliedMake));
  }, [appliedMake]);
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8",
    children: [/* @__PURE__ */ jsx("div", {
      className: "mb-6",
      children: /* @__PURE__ */ jsx(Breadcrumb, {
        items: [{
          label: "Home",
          href: "/"
        }, {
          label: "Popular Bundles"
        }]
      })
    }), /* @__PURE__ */ jsx(BundlesHero, {
      vehicleValue,
      onVehicleChange: setVehicleValue,
      onFilter: handleFilter
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-10",
      children: bundles.length > 0 ? /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
        children: bundles.map((b) => /* @__PURE__ */ jsx(BundleCard, {
          bundle: b
        }, b.id))
      }) : /* @__PURE__ */ jsx("div", {
        className: "rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted",
        children: "No bundles match that vehicle yet — check back soon."
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-16",
      children: /* @__PURE__ */ jsx(WhyChooseBundles, {})
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BundlesListing,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function formatCurrency$4(value) {
  return `A$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function CartItemCard({ item }) {
  const { setQuantity, removeFromCart } = useCart();
  const lineTotal = item.price * item.quantity;
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-4 rounded-2xl border border-border bg-bg-2 p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "h-24 w-24 shrink-0 overflow-hidden rounded-xl", children: /* @__PURE__ */ jsx("img", { src: item.img, alt: item.title, className: "h-full w-full object-cover", loading: "lazy" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          item.category && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-accent", children: item.category }),
          /* @__PURE__ */ jsx("h3", { className: "mt-0.5 truncate font-bold text-fg", children: item.title }),
          item.meta && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-fg-muted", children: item.meta })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => removeFromCart(item.id),
            className: "shrink-0 rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-danger/10 hover:text-danger",
            "aria-label": `Remove ${item.title}`,
            children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-wrap items-end justify-between gap-3 pt-3", children: [
        /* @__PURE__ */ jsx(QuantityStepper, { value: item.quantity, onChange: (q) => setQuantity(item.id, q) }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-lg font-black text-fg", children: formatCurrency$4(lineTotal) }),
          item.shippingNote && /* @__PURE__ */ jsx("div", { className: "text-xs text-fg-muted", children: item.shippingNote })
        ] })
      ] })
    ] })
  ] });
}
const SHIPPING_COST = 145;
const GST_RATE = 0.1;
const GST_DIVISOR = 11;
function formatCurrency$3(value) {
  return `A$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function OrderSummary({ subtotal, onCheckout }) {
  const shipping = SHIPPING_COST;
  const gst = (subtotal + shipping) * GST_RATE;
  const total = subtotal + shipping + gst;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-fg", children: "Order Summary" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency$3(subtotal) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Express Shipping" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-accent", children: formatCurrency$3(shipping) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "GST (10%)" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency$3(gst) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-fg", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-black text-accent", children: formatCurrency$3(total) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-right text-xs text-fg-muted", children: "AUD Dollars" })
    ] }),
    /* @__PURE__ */ jsxs(Button, { size: "sm", className: "mt-6 w-full text-xs gap-2 uppercase tracking-wide", onClick: onCheckout, children: [
      /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }),
      "Proceed to Secure Checkout"
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-5 text-center text-xs leading-relaxed text-fg-muted", children: [
      "Secure 256-bit SSL encrypted checkout.",
      /* @__PURE__ */ jsx("br", {}),
      "All components include 12-month workshop warranty."
    ] })
  ] });
}
function EmptyCart() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center rounded-2xl border border-border bg-bg-2 px-6 py-20 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-bg-3 text-fg-muted", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-lg font-bold text-fg", children: "Your cart is empty" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm text-sm text-fg-muted", children: "Looks like you haven't added any parts yet. Browse our catalog to start building your setup." }),
    /* @__PURE__ */ jsx(Button, { size: "lg", className: "mt-6", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Browse Parts" }) })
  ] });
}
function Cart() {
  const {
    items,
    totalItems,
    totalPrice
  } = useCart();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("main", {
    className: "mx-auto max-w-7xl px-4 pb-16  pt-20 lg:pt-28  sm:px-6 lg:px-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "mb-8 flex flex-wrap items-center justify-between gap-4",
      children: [/* @__PURE__ */ jsxs("h1", {
        className: "font-display text-2xl font-black tracking-wide text-fg sm:text-3xl",
        children: ["Your Performance Build", " ", /* @__PURE__ */ jsxs("span", {
          className: "text-fg-muted",
          children: ["(", totalItems, " ", totalItems === 1 ? "Item" : "Items", ")"]
        })]
      }), /* @__PURE__ */ jsxs(Link, {
        to: "/shop",
        className: "flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          className: "h-4 w-4"
        }), " Keep Shopping"]
      })]
    }), items.length === 0 ? /* @__PURE__ */ jsx(EmptyCart, {}) : /* @__PURE__ */ jsxs("div", {
      className: "grid min-w-0 gap-8 lg:grid-cols-[1fr_360px]",
      children: [/* @__PURE__ */ jsx("div", {
        className: "min-w-0 space-y-4",
        children: items.map((item) => /* @__PURE__ */ jsx(CartItemCard, {
          item
        }, item.id))
      }), /* @__PURE__ */ jsx("div", {
        className: "min-w-0 lg:sticky lg:top-24 lg:self-start",
        children: /* @__PURE__ */ jsx(OrderSummary, {
          subtotal: totalPrice,
          onCheckout: () => navigate("/checkout")
        })
      })]
    })]
  });
}
const Cart_default = UNSAFE_withComponentProps(Cart);
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cart_default
}, Symbol.toStringTag, { value: "Module" }));
function CheckoutHeader({ showReturnToCart = true }) {
  return /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-bg-2", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "font-display text-base font-bold tracking-wider text-accent", children: "PARTS HUB AUSTRALIA" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      showReturnToCart && /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/cart",
          className: "flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Return to Cart" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent", children: [
        /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Secure Checkout" })
      ] })
    ] })
  ] }) });
}
const CHECKOUT_STEPS = ["Shipping", "Payment", "Review"];
const AU_STATES = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const TRUST_BADGES = [
  { title: "Secure SSL Encryption", description: "Your data is protected and encrypted" },
  { title: "24-Month Parts Warranty", description: "Genuine quality guarantee" },
  { title: "Specialist Support", description: "Expert help for your {make} project" }
];
const WHATS_NEXT_ITEMS = [
  {
    title: "Real-time Tracking",
    description: "Receive SMS & email updates as your parts move through our logistics network. Delivery ETA: 2-3 business days.",
    actionLabel: "Track Shipment"
  },
  {
    title: "Technical Support",
    description: "Access installation guides, fitment FAQs, or chat with our specialist mechanics for part-specific advice.",
    actionLabel: "Get Assistance"
  }
];
const LOYALTY_PROGRAM = {
  title: "PH Loyalty Program",
  description: "Join 50k+ enthusiasts. Earn {points} points from this order. Unlock exclusive early access to performance drops.",
  actionLabel: "Join Now"
};
const COMPANY_INFO = {
  name: "Parts Hub Australia",
  abn: "45 678 910 112"
};
const INVOICE_NOTE = "Please ensure installation is performed by a certified technician to maintain fitment guarantee.";
function CheckoutStepper({ currentStep }) {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: CHECKOUT_STEPS.map((step, i) => {
    const num = i + 1;
    const isActive = num === currentStep;
    const isDone = num < currentStep;
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
              isActive || isDone ? "bg-accent text-accent-fg" : "border border-border bg-bg-2 text-fg-muted"
            ),
            children: num
          }
        ),
        /* @__PURE__ */ jsx("span", { className: cn("text-xs font-semibold", isActive ? "text-fg" : "text-fg-muted"), children: step })
      ] }),
      i < CHECKOUT_STEPS.length - 1 && /* @__PURE__ */ jsx("span", { className: "mx-4 mb-5 h-px w-12 border-t border-dashed border-border sm:w-20" })
    ] }, step);
  }) });
}
function FitmentGuaranteeBanner({ vehicleLabel }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-accent/10 px-5 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-accent", children: "Fitment Guarantee" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-fg-muted", children: [
          "Confirmed parts for: ",
          vehicleLabel
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Link, { to: "/#vehicle-selector", className: "shrink-0 text-sm font-semibold text-accent hover:underline", children: "Change Vehicle" })
  ] });
}
const IconInput = React.forwardRef(
  function IconInput2({ icon: Icon, className, ...props }, ref) {
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Icon, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" }),
      /* @__PURE__ */ jsx(Input, { ref, className: cn("pl-11", className), ...props })
    ] });
  }
);
function ShippingForm({ values, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-accent" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-fg", children: "Shipping Details" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Full Name" }),
        /* @__PURE__ */ jsx(
          IconInput,
          {
            icon: User,
            placeholder: "John Doe",
            value: values.fullName,
            onChange: (e) => onChange({ fullName: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Email Address" }),
          /* @__PURE__ */ jsx(
            IconInput,
            {
              icon: Mail,
              type: "email",
              placeholder: "john@example.com",
              value: values.email,
              onChange: (e) => onChange({ email: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Phone Number" }),
          /* @__PURE__ */ jsx(
            IconInput,
            {
              icon: Phone,
              type: "tel",
              placeholder: "+61 400 000 000",
              value: values.phone,
              onChange: (e) => onChange({ phone: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Street Address" }),
        /* @__PURE__ */ jsx(
          IconInput,
          {
            icon: Home$1,
            placeholder: "123 Performance Way",
            value: values.address,
            onChange: (e) => onChange({ address: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px_120px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Suburb" }),
          /* @__PURE__ */ jsx(
            IconInput,
            {
              icon: Building2,
              placeholder: "Melbourne",
              value: values.suburb,
              onChange: (e) => onChange({ suburb: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "State" }),
          /* @__PURE__ */ jsx(
            Select,
            {
              value: values.state,
              onValueChange: (v) => onChange({ state: v }),
              options: AU_STATES.map((s) => ({ value: s, label: s }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-fg-muted", children: "Postcode" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "3000",
              value: values.postcode,
              onChange: (e) => onChange({ postcode: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2 pt-2 text-sm text-fg-muted", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: values.billingSameAsShipping,
            onChange: (e) => onChange({ billingSameAsShipping: e.target.checked })
          }
        ),
        "My billing address is the same as shipping"
      ] })
    ] })
  ] });
}
const BADGE_ICONS = [ShieldCheck, BadgeCheck, Headphones];
function formatCurrency$2(value) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function CheckoutOrderSummary({
  items,
  subtotal,
  vehicleMake,
  onContinue,
  submitting = false,
  disabled = false
}) {
  const gst = subtotal / GST_DIVISOR;
  const total = subtotal;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-fg", children: "Order Summary" }),
    /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-4", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 w-12 shrink-0 overflow-hidden rounded-lg", children: /* @__PURE__ */ jsx("img", { src: item.img, alt: item.title, className: "h-full w-full object-cover", loading: "lazy" }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-fg", children: item.title }),
        item.meta && /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-fg-muted", children: item.meta }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-fg-muted", children: [
          "Qty: ",
          item.quantity
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "shrink-0 text-sm font-bold text-fg", children: formatCurrency$2(item.price * item.quantity) })
    ] }, item.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3 border-t border-border pt-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency$2(subtotal) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Shipping (Express)" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-ok", children: "FREE" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Includes GST" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency$2(gst) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline justify-between border-t border-border pt-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-fg", children: "Total" }),
      /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-black text-accent", children: formatCurrency$2(total) })
    ] }),
    /* @__PURE__ */ jsx(Button, { size: "lg", className: "mt-6 w-full gap-2", onClick: onContinue, disabled: disabled || submitting, children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      "Placing Order…"
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      "Continue to Payment",
      /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-3", children: TRUST_BADGES.map((badge, i) => {
      const Icon = BADGE_ICONS[i];
      const description = badge.description.replace("{make}", vehicleMake ?? "your");
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-bg-3 px-4 py-3", children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 shrink-0 text-accent" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-fg", children: badge.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-fg-muted", children: description })
        ] })
      ] }, badge.title);
    }) })
  ] });
}
function useHasRehydrated() {
  return useSelector((state) => {
    const persist = state._persist;
    return (persist == null ? void 0 : persist.rehydrated) ?? false;
  });
}
const createOrder = async (payload) => {
  const { data } = await apiClient.post(
    "/order",
    payload
  );
  return data;
};
const getOrder = async (orderId, token) => {
  const { data } = await apiClient.get(
    `/order/${orderId}`,
    { params: { token } }
  );
  return data;
};
const INITIAL_SHIPPING = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  billingSameAsShipping: true
};
function isShippingComplete(s) {
  return Boolean(s.fullName.trim() && s.email.trim() && s.phone.trim() && s.address.trim() && s.suburb.trim() && s.postcode.trim());
}
function CheckoutShipping() {
  const {
    items,
    totalPrice
  } = useCart();
  const {
    vehicle
  } = useVehicle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shipping, setShipping] = useState(INITIAL_SHIPPING);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const hasRehydrated = useHasRehydrated();
  useEffect(() => {
    if (!hasRehydrated) return;
    if (items.length === 0) navigate("/cart", {
      replace: true
    });
  }, [hasRehydrated, items.length, navigate]);
  if (!hasRehydrated || items.length === 0) return null;
  const vehicleLabel = (vehicle == null ? void 0 : vehicle.make) ? [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ") : void 0;
  function updateShipping(patch) {
    setShipping((prev) => ({
      ...prev,
      ...patch
    }));
  }
  async function handleContinue() {
    if (!isShippingComplete(shipping)) {
      setError("Please fill in all shipping details before continuing.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await createOrder({
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity
        })),
        customer: {
          name: shipping.fullName,
          email: shipping.email,
          phone: shipping.phone
        },
        shipping_address: {
          address: shipping.address,
          suburb: shipping.suburb,
          state: shipping.state,
          postcode: shipping.postcode
        },
        // The form only collects a single address today (no separate billing
        // address fields exist yet even when "same as shipping" is unchecked)
        // — always send null (same-as-shipping) until that UI is built.
        billing_address: null
      });
      const order = res.data;
      dispatch(setOrder({
        orderId: order._id,
        guestToken: order.guest_access_token,
        orderNumber: order.order_number
      }));
      const params = new URLSearchParams({
        order_id: order._id,
        token: order.guest_access_token
      });
      navigate(`/checkout/payment?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order. Please try again.");
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg",
    children: [/* @__PURE__ */ jsx(CheckoutHeader, {}), /* @__PURE__ */ jsxs("main", {
      className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
      children: [/* @__PURE__ */ jsx(CheckoutStepper, {
        currentStep: 1
      }), vehicleLabel && /* @__PURE__ */ jsx("div", {
        className: "mt-8",
        children: /* @__PURE__ */ jsx(FitmentGuaranteeBanner, {
          vehicleLabel
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-8 grid gap-8 lg:grid-cols-[1fr_380px]",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(ShippingForm, {
            values: shipping,
            onChange: updateShipping
          }), error && /* @__PURE__ */ jsx("p", {
            role: "alert",
            className: "mt-4 text-sm font-medium text-danger",
            children: error
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "min-w-0 lg:sticky lg:top-8 lg:self-start",
          children: /* @__PURE__ */ jsx(CheckoutOrderSummary, {
            items,
            subtotal: totalPrice,
            vehicleMake: vehicle == null ? void 0 : vehicle.make,
            onContinue: handleContinue,
            submitting
          })
        })]
      })]
    })]
  });
}
const Shipping = UNSAFE_withComponentProps(CheckoutShipping);
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CheckoutShipping,
  default: Shipping
}, Symbol.toStringTag, { value: "Module" }));
const createPaymentIntent = async (payload) => {
  const { data } = await apiClient.post(
    "/payment/create-intent",
    payload
  );
  return data;
};
let stripePromise = null;
function getStripe() {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then(
      ({ loadStripe }) => loadStripe("pk_test_51TtNy6A7HpU4lHdnj0aB4mxS3TSlWs7zxSrnw1e7jJDM05d8H7jHPPNDASvuTSH2j3MC8Ll9PEcsDOQI2I0zCkOl00K9FJ10Bq")
    );
  }
  return stripePromise;
}
function PaymentForm({
  orderId,
  guestToken,
  orderNumber
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setCardError(null);
    const returnUrl = new URL("/checkout/confirmation", window.location.origin);
    returnUrl.searchParams.set("order_id", orderId);
    returnUrl.searchParams.set("token", guestToken);
    const {
      error
    } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl.toString()
      }
    });
    if (error) {
      setCardError(error.message ?? "Payment failed — please check your card details and try again.");
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: handleSubmit,
    className: "rounded-2xl border border-border bg-bg-2 p-6",
    children: [/* @__PURE__ */ jsx("h2", {
      className: "mb-4 text-lg font-bold text-fg",
      children: "Payment"
    }), /* @__PURE__ */ jsx(PaymentElement, {}), cardError && /* @__PURE__ */ jsx("p", {
      role: "alert",
      className: "mt-4 text-sm font-medium text-danger",
      children: cardError
    }), /* @__PURE__ */ jsx(Button, {
      type: "submit",
      size: "lg",
      className: "mt-6 w-full gap-2",
      disabled: !stripe || submitting,
      children: submitting ? /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "h-4 w-4 animate-spin"
        }), "Processing…"]
      }) : "Pay Now"
    }), /* @__PURE__ */ jsxs("p", {
      className: "mt-4 flex items-center justify-center gap-2 text-xs text-fg-muted",
      children: [/* @__PURE__ */ jsx(ShieldCheck, {
        className: "h-3.5 w-3.5"
      }), "Payments are securely processed by Stripe", orderNumber ? ` — order ${orderNumber}` : ""]
    })]
  });
}
function CheckoutPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    orderId: sliceOrderId,
    guestToken: sliceGuestToken,
    orderNumber
  } = useSelector((s) => s.checkout);
  const paramOrderId = searchParams.get("order_id");
  const paramGuestToken = searchParams.get("token");
  const orderId = sliceOrderId ?? paramOrderId;
  const guestToken = sliceGuestToken ?? paramGuestToken;
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stripePromise2, setStripePromise] = useState(null);
  useEffect(() => {
    setStripePromise(getStripe());
  }, []);
  useEffect(() => {
    if (!orderId || !guestToken) {
      navigate("/checkout", {
        replace: true
      });
      return;
    }
    if (!sliceOrderId || !sliceGuestToken) {
      dispatch(setOrder({
        orderId,
        guestToken,
        orderNumber: orderNumber ?? ""
      }));
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    createPaymentIntent({
      order_id: orderId,
      token: guestToken
    }).then((res) => {
      if (!cancelled) setClientSecret(res.data.client_secret);
    }).catch((err) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [orderId, guestToken, sliceOrderId, sliceGuestToken, orderNumber, dispatch, navigate]);
  if (!orderId || !guestToken) return null;
  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: "stripe"
    }
  } : void 0;
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg",
    children: [/* @__PURE__ */ jsx(CheckoutHeader, {}), /* @__PURE__ */ jsxs("main", {
      className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
      children: [/* @__PURE__ */ jsx(CheckoutStepper, {
        currentStep: 2
      }), /* @__PURE__ */ jsxs("div", {
        className: "mx-auto mt-8 max-w-xl",
        children: [loading && /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col items-center gap-3 rounded-2xl border border-border bg-bg-2 p-10 text-center",
          children: [/* @__PURE__ */ jsx(Loader2, {
            className: "h-6 w-6 animate-spin text-accent"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-fg-muted",
            children: "Preparing secure payment…"
          })]
        }), !loading && error && /* @__PURE__ */ jsxs("div", {
          className: "rounded-2xl border border-border bg-bg-2 p-6 text-center",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-sm font-medium text-danger",
            children: error
          }), /* @__PURE__ */ jsx(Button, {
            className: "mt-4",
            onClick: () => window.location.reload(),
            children: "Try Again"
          })]
        }), !loading && !error && clientSecret && /* @__PURE__ */ jsx(Elements, {
          stripe: stripePromise2,
          options,
          children: /* @__PURE__ */ jsx(PaymentForm, {
            orderId,
            guestToken,
            orderNumber
          })
        })]
      })]
    })]
  });
}
const Payment = UNSAFE_withComponentProps(CheckoutPayment);
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CheckoutPayment,
  default: Payment
}, Symbol.toStringTag, { value: "Module" }));
function useCopyToClipboard(resetDelay = 2e3) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    (text) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      });
    },
    [resetDelay]
  );
  return { copied, copy };
}
function OrderConfirmedHero({ orderReference }) {
  const { copied, copy } = useCopyToClipboard();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent", children: [
      /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
      "Transaction Secure"
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-black tracking-wide text-fg sm:text-4xl", children: "Order Confirmed" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-md text-fg-muted", children: "Your high-performance components have been secured. We're preparing your shipment at our Melbourne facility." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-bg-2 px-4 py-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-fg-muted", children: "Order Reference" }),
        /* @__PURE__ */ jsxs("p", { className: "font-bold text-fg", children: [
          "#",
          orderReference
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => copy(orderReference),
          className: "flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-3 hover:text-fg",
          "aria-label": "Copy order reference",
          children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-ok" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
        }
      )
    ] })
  ] });
}
function WhatsNextCard({ item, icon: Icon }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-bg-2 p-5", children: [
    /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx("h3", { className: "mt-3 font-bold text-fg", children: item.title }),
    /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-fg-muted", children: item.description }),
    /* @__PURE__ */ jsxs("button", { type: "button", className: "mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent transition-all hover:gap-1.5", children: [
      item.actionLabel,
      " ",
      /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
    ] })
  ] });
}
function LoyaltyProgramBanner({ pointsEarned }) {
  const description = LOYALTY_PROGRAM.description.replace("{points}", pointsEarned.toLocaleString());
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-accent/10 px-5 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg", children: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-accent", children: LOYALTY_PROGRAM.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-fg-muted", children: description })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Button, { size: "sm", className: "shrink-0", children: LOYALTY_PROGRAM.actionLabel })
  ] });
}
function PrecisionGuaranteedCard({ img }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-6 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 text-accent", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsx("h3", { className: "mt-4 font-bold text-fg", children: "Precision Guaranteed" }),
    /* @__PURE__ */ jsx("p", { className: "mx-auto mt-1.5 max-w-xs text-sm text-fg-muted", children: "Every component is checked against OEM specifications before leaving our warehouse." }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto mt-5 h-40 w-40 overflow-hidden rounded-xl", children: /* @__PURE__ */ jsx("img", { src: img, alt: "Precision-checked component", className: "h-full w-full object-cover", loading: "lazy" }) })
  ] });
}
function ConfirmationSummaryLinks() {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-fg", children: "Checkout Summary" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-fg-muted", children: "Secure Purchase Complete" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg bg-accent/10 px-3 py-2.5 text-sm font-semibold text-accent", children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 shrink-0" }),
        "Order Summary"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 text-sm text-fg-muted", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 shrink-0" }),
        "Fitment Guarantee"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 text-sm text-fg-muted", children: [
        /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 shrink-0" }),
        "Express Shipping"
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/checkout/invoice",
          className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-bg-3 hover:text-fg",
          children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Tax Invoice" }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 shrink-0" })
          ]
        }
      )
    ] })
  ] });
}
const WHATS_NEXT_ICONS = [Truck, Wrench];
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 3e4;
const PRECISION_IMG = "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400&h=400&fit=crop";
function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  const [order, setOrderState] = useState(null);
  const [phase, setPhase] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const clearedRef = useRef(false);
  useEffect(() => {
    if (!orderId || !token) {
      setPhase("error");
      setErrorMessage("Missing order reference — this link looks incomplete.");
      return;
    }
    let cancelled = false;
    let timer;
    const startedAt = Date.now();
    async function poll() {
      try {
        const res = await getOrder(orderId, token);
        if (cancelled) return;
        setOrderState(res.data);
        if (res.data.status === "paid" || res.data.status === "fulfilled" || res.data.status === "partially_refunded" || res.data.status === "refunded") {
          setPhase("ready");
          return;
        }
        if (res.data.status === "cancelled") {
          setPhase("cancelled");
          return;
        }
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          setPhase("timeout");
          return;
        }
        setPhase("polling");
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setPhase("error");
          setErrorMessage(err.message || "Could not load your order.");
          return;
        }
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          setPhase("timeout");
          return;
        }
        setPhase("polling");
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }
    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, token]);
  useEffect(() => {
    if (phase === "ready" && !clearedRef.current) {
      clearedRef.current = true;
      dispatch(clearCart());
      dispatch(resetCheckout());
    }
  }, [phase, dispatch]);
  if (phase === "loading" || phase === "polling") {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg",
      children: [/* @__PURE__ */ jsx(CheckoutHeader, {
        showReturnToCart: false
      }), /* @__PURE__ */ jsxs("main", {
        className: "mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6",
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "h-8 w-8 animate-spin text-accent"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-lg font-bold text-fg",
          children: "Confirming your payment…"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-fg-muted",
          children: "This usually takes just a few seconds. Please don't close this page."
        })]
      })]
    });
  }
  if (phase === "timeout") {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg",
      children: [/* @__PURE__ */ jsx(CheckoutHeader, {
        showReturnToCart: false
      }), /* @__PURE__ */ jsxs("main", {
        className: "mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-8 w-8 text-accent"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-lg font-bold text-fg",
          children: "Still confirming your payment"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-fg-muted",
          children: ["This is taking longer than expected. You'll receive an email confirmation once it's done — no need to pay again. If you don't hear back soon, contact us with order reference", " ", /* @__PURE__ */ jsxs("span", {
            className: "font-semibold text-fg",
            children: ["#", (order == null ? void 0 : order.order_number) ?? "—"]
          }), "."]
        }), /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          asChild: true,
          className: "mt-2",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/shop",
            children: "Continue Shopping"
          })
        })]
      })]
    });
  }
  if (phase === "cancelled") {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg",
      children: [/* @__PURE__ */ jsx(CheckoutHeader, {
        showReturnToCart: false
      }), /* @__PURE__ */ jsxs("main", {
        className: "mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6",
        children: [/* @__PURE__ */ jsx(XCircle, {
          className: "h-8 w-8 text-danger"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-lg font-bold text-fg",
          children: "This order was cancelled"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-fg-muted",
          children: ["Order #", (order == null ? void 0 : order.order_number) ?? "—", " was cancelled before payment completed. Please return to your cart to place a new order."]
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-2 flex gap-3",
          children: /* @__PURE__ */ jsx(Button, {
            asChild: true,
            children: /* @__PURE__ */ jsx(Link, {
              to: "/cart",
              children: "Return to Cart"
            })
          })
        })]
      })]
    });
  }
  if (phase === "error") {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg",
      children: [/* @__PURE__ */ jsx(CheckoutHeader, {
        showReturnToCart: false
      }), /* @__PURE__ */ jsxs("main", {
        className: "mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-8 w-8 text-danger"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-lg font-bold text-fg",
          children: "Couldn't load your order"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-fg-muted",
          children: errorMessage
        }), /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          asChild: true,
          className: "mt-2",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/shop",
            children: "Continue Shopping"
          })
        })]
      })]
    });
  }
  if (!order) return null;
  const pointsEarned = Math.round(order.total / 100 / 10);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg",
    children: [/* @__PURE__ */ jsx(CheckoutHeader, {
      showReturnToCart: false
    }), /* @__PURE__ */ jsx("main", {
      className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid gap-8 lg:grid-cols-[1fr_340px]",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(OrderConfirmedHero, {
            orderReference: order.order_number
          }), order.has_stock_issue && /* @__PURE__ */ jsxs("div", {
            className: "mt-6 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-fg",
            children: [/* @__PURE__ */ jsx(AlertTriangle, {
              className: "mt-0.5 h-4 w-4 shrink-0 text-accent"
            }), /* @__PURE__ */ jsx("p", {
              children: "One or more items in this order may be delayed due to a stock discrepancy — our team has been notified and will be in touch if anything changes with your shipment."
            })]
          }), /* @__PURE__ */ jsx("h2", {
            className: "mb-4 mt-8 text-lg font-bold text-fg",
            children: "What's Next"
          }), /* @__PURE__ */ jsx("div", {
            className: "grid gap-4 sm:grid-cols-2",
            children: WHATS_NEXT_ITEMS.map((item, i) => /* @__PURE__ */ jsx(WhatsNextCard, {
              item,
              icon: WHATS_NEXT_ICONS[i]
            }, item.title))
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-4",
            children: /* @__PURE__ */ jsx(LoyaltyProgramBanner, {
              pointsEarned
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-8 flex flex-col gap-3 sm:flex-row",
            children: [/* @__PURE__ */ jsx(Button, {
              size: "lg",
              asChild: true,
              children: /* @__PURE__ */ jsx(Link, {
                to: `/checkout/invoice?order_id=${order._id}&token=${token}`,
                children: "View Order Status"
              })
            }), /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              size: "lg",
              asChild: true,
              children: /* @__PURE__ */ jsx(Link, {
                to: "/shop",
                children: "Continue Shopping"
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "min-w-0 space-y-6 lg:sticky lg:top-8 lg:self-start",
          children: [/* @__PURE__ */ jsx(PrecisionGuaranteedCard, {
            img: PRECISION_IMG
          }), /* @__PURE__ */ jsx(ConfirmationSummaryLinks, {})]
        })]
      })
    })]
  });
}
const Confirmation = UNSAFE_withComponentProps(OrderConfirmation);
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OrderConfirmation,
  default: Confirmation
}, Symbol.toStringTag, { value: "Module" }));
function InvoiceHeader() {
  return /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-bg-2 print:hidden", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "shrink-0 whitespace-nowrap font-display text-sm font-bold tracking-wider text-accent sm:text-base", children: "PARTS HUB AUSTRALIA" }),
    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2 sm:gap-4", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/checkout/confirmation",
          className: "flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-fg-muted transition-colors hover:text-fg",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 sm:hidden" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Back to Confirmation" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "secondary", className: "gap-2", onClick: () => window.print(), children: [
        /* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Print Invoice" })
      ] }),
      /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 shrink-0 text-accent" })
    ] })
  ] }) });
}
function InvoiceTitleBlock({ invoiceNumber, orderReference, date, isPaid = true }) {
  const formattedDate = new Date(date).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-6 rounded-2xl border border-border bg-bg-2 p-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-black tracking-wide text-fg sm:text-3xl", children: "Tax Invoice" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-fg-muted", children: [
        COMPANY_INFO.name,
        " | ABN ",
        COMPANY_INFO.abn
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: isPaid ? "inline-block rounded-full bg-ok/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ok" : "inline-block rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent",
          children: isPaid ? "Payment Status: Paid & Secured" : "Payment Status: Pending"
        }
      ),
      /* @__PURE__ */ jsxs("dl", { className: "mt-3 space-y-1 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-fg-muted", children: "Invoice #" }),
          /* @__PURE__ */ jsx("dd", { className: "font-semibold text-fg", children: invoiceNumber })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-fg-muted", children: "Date" }),
          /* @__PURE__ */ jsx("dd", { className: "font-semibold text-fg", children: formattedDate })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-fg-muted", children: "Order Ref" }),
          /* @__PURE__ */ jsxs("dd", { className: "font-semibold text-fg", children: [
            "#",
            orderReference
          ] })
        ] })
      ] })
    ] })
  ] });
}
function InvoiceAddressCard({ label, address }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-accent", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm leading-relaxed text-fg", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: address.fullName }),
      /* @__PURE__ */ jsx("p", { className: "text-fg-muted", children: address.address }),
      /* @__PURE__ */ jsxs("p", { className: "text-fg-muted", children: [
        address.suburb,
        ", ",
        address.state,
        " ",
        address.postcode
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-fg-muted", children: address.country })
    ] })
  ] });
}
function formatCurrency$1(value) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function InvoiceItemsTable({ items }) {
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-2xl border border-border bg-bg-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[560px] text-left text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-bg-3 text-xs uppercase tracking-wider text-fg-muted", children: [
      /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold", children: "SKU" }),
      /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold", children: "Description" }),
      /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Qty" }),
      /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Unit Price" }),
      /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Total" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: items.map((item, i) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border last:border-0", children: [
      /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-accent", children: item.sku ?? "—" }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("p", { className: "font-semibold text-fg", children: item.name }) }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-fg-muted", children: item.quantity }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-fg-muted", children: formatCurrency$1(item.unitPrice) }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right font-bold text-fg", children: formatCurrency$1(item.unitPrice * item.quantity) })
    ] }, item.sku ?? i)) })
  ] }) });
}
function formatCurrency(value) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function InvoicePaymentAndTotals({ paymentMethod, subtotal, shipping, gst, total }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-fg-muted", children: "Payment Information" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 shrink-0 text-accent" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "font-semibold text-fg", children: [
            paymentMethod.brand,
            " Ending in ",
            paymentMethod.last4
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-fg-muted", children: "Processed via Secure Gateway" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs italic leading-relaxed text-fg-muted", children: [
        '"',
        INVOICE_NOTE,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-bg-2 p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency(subtotal) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Shipping (Express Premium)" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency(shipping) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-fg-muted", children: "Includes GST" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-fg", children: formatCurrency(gst) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-fg", children: "Total Amount" }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-black text-accent", children: formatCurrency(total) })
      ] })
    ] })
  ] });
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function toInvoiceAddress(order, fullName) {
  const addr = order.billing_address ?? order.shipping_address;
  return {
    fullName,
    address: addr.address,
    suburb: addr.suburb,
    state: addr.state,
    postcode: addr.postcode,
    country: "Australia"
  };
}
function Invoice() {
  var _a, _b;
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  const [order, setOrder2] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!orderId || !token) {
      setError("Missing order reference — this link looks incomplete.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    getOrder(orderId, token).then((res) => {
      if (!cancelled) setOrder2(res.data);
    }).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this invoice.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [orderId, token]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg",
      children: [/* @__PURE__ */ jsx(InvoiceHeader, {}), /* @__PURE__ */ jsxs("main", {
        className: "mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6",
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "h-6 w-6 animate-spin text-accent"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-fg-muted",
          children: "Loading invoice…"
        })]
      })]
    });
  }
  if (error || !order) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-bg",
      children: [/* @__PURE__ */ jsx(InvoiceHeader, {}), /* @__PURE__ */ jsxs("main", {
        className: "mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6",
        children: [/* @__PURE__ */ jsx(AlertTriangle, {
          className: "h-6 w-6 text-danger"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-fg-muted",
          children: error ?? "Invoice not found."
        })]
      })]
    });
  }
  const items = order.items.map((item) => ({
    sku: item.sku,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unit_price / 100
  }));
  const isPaid = order.status !== "pending_payment" && order.status !== "cancelled";
  const paymentMethod = {
    brand: ((_a = order.payment) == null ? void 0 : _a.card_brand) ? capitalize(order.payment.card_brand) : "Card",
    last4: ((_b = order.payment) == null ? void 0 : _b.card_last4) ?? "----"
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-bg",
    children: [/* @__PURE__ */ jsx(InvoiceHeader, {}), /* @__PURE__ */ jsxs("main", {
      className: "mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8",
      children: [/* @__PURE__ */ jsx(InvoiceTitleBlock, {
        invoiceNumber: order.order_number,
        orderReference: order.order_number,
        date: order.created_at,
        isPaid
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 sm:grid-cols-2",
        children: [/* @__PURE__ */ jsx(InvoiceAddressCard, {
          label: "Bill To",
          address: toInvoiceAddress(order, order.customer.name)
        }), /* @__PURE__ */ jsx(InvoiceAddressCard, {
          label: "Ship To",
          address: {
            fullName: order.customer.name,
            address: order.shipping_address.address,
            suburb: order.shipping_address.suburb,
            state: order.shipping_address.state,
            postcode: order.shipping_address.postcode,
            country: "Australia"
          }
        })]
      }), /* @__PURE__ */ jsx(InvoiceItemsTable, {
        items
      }), /* @__PURE__ */ jsx(InvoicePaymentAndTotals, {
        paymentMethod,
        subtotal: order.subtotal / 100,
        shipping: order.shipping_cost / 100,
        gst: order.tax_amount / 100,
        total: order.total / 100
      })]
    })]
  });
}
const Invoice_default = UNSAFE_withComponentProps(Invoice);
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Invoice,
  default: Invoice_default
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CjfTFx-J.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/index-k16Bg4dw.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-U91LDoqS.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/index-k16Bg4dw.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/index-Bh23Db3j.js", "/assets/VehicleContext-CICPek2g.js", "/assets/cartSlice-DULQPWT4.js", "/assets/checkoutSlice-B317Qt-P.js", "/assets/clsx-B-dksMZM.js"], "css": ["/assets/root-DUVY50yx.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "components/layout/Layout": { "id": "components/layout/Layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Layout-Co7W6uhs.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/button-BLqxxX3x.js", "/assets/cn-DaoVIXo8.js", "/assets/useCart-BSAg613H.js", "/assets/VehicleContext-CICPek2g.js", "/assets/categories-hMRbstCl.js", "/assets/search-BIlTSKmR.js", "/assets/shopping-cart-CgXQakMs.js", "/assets/user-CAQUs_6u.js", "/assets/x-D9PS03B8.js", "/assets/index-Bh23Db3j.js", "/assets/input-7tnMIZh9.js", "/assets/client-Fr3cYQ_G.js", "/assets/map-pin-LLYuwY8E.js", "/assets/arrow-right-fZWVfoXd.js", "/assets/index-k16Bg4dw.js", "/assets/select-B7yKCvVh.js", "/assets/clsx-B-dksMZM.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/cartSlice-DULQPWT4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Home": { "id": "pages/Home", "parentId": "components/layout/Layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Home-DtCBAetA.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/button-BLqxxX3x.js", "/assets/VehicleContext-CICPek2g.js", "/assets/arrow-right-fZWVfoXd.js", "/assets/select-B7yKCvVh.js", "/assets/input-7tnMIZh9.js", "/assets/client-Fr3cYQ_G.js", "/assets/car-front-DiF8fqCp.js", "/assets/search-BIlTSKmR.js", "/assets/CategoryCard-D5ZNZkqV.js", "/assets/useCart-BSAg613H.js", "/assets/productToCartItem-DXbGcsr2.js", "/assets/shopping-cart-CgXQakMs.js", "/assets/shield-check-BDn8nWOV.js", "/assets/truck-Bu-Q-MhJ.js", "/assets/headphones-N5CR7p__.js", "/assets/cn-DaoVIXo8.js", "/assets/map-pin-LLYuwY8E.js", "/assets/index-k16Bg4dw.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/index-Bh23Db3j.js", "/assets/clsx-B-dksMZM.js", "/assets/cartSlice-DULQPWT4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/CategoriesGrid": { "id": "pages/CategoriesGrid", "parentId": "components/layout/Layout", "path": "categories", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/CategoriesGrid-BGSDXYnt.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/Breadcrumb-C-CyQQSx.js", "/assets/CategoryCard-D5ZNZkqV.js", "/assets/input-7tnMIZh9.js", "/assets/categories-hMRbstCl.js", "/assets/search-BIlTSKmR.js", "/assets/chevron-right-CIgV92vm.js", "/assets/cn-DaoVIXo8.js", "/assets/clsx-B-dksMZM.js", "/assets/client-Fr3cYQ_G.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ProductsListing": { "id": "pages/ProductsListing", "parentId": "components/layout/Layout", "path": "shop/:categoryId?", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/ProductsListing-dnnTBQYT.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/Breadcrumb-C-CyQQSx.js", "/assets/VehicleContext-CICPek2g.js", "/assets/car-front-DiF8fqCp.js", "/assets/cn-DaoVIXo8.js", "/assets/x-D9PS03B8.js", "/assets/checkbox-C2aZShy0.js", "/assets/input-7tnMIZh9.js", "/assets/select-B7yKCvVh.js", "/assets/useCart-BSAg613H.js", "/assets/productToCartItem-DXbGcsr2.js", "/assets/mapApiProduct-CrNg4m4Q.js", "/assets/shopping-cart-CgXQakMs.js", "/assets/chevron-right-CIgV92vm.js", "/assets/clsx-B-dksMZM.js", "/assets/check-CRDfOD-w.js", "/assets/index-k16Bg4dw.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/index-Bh23Db3j.js", "/assets/cartSlice-DULQPWT4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ProductDetails": { "id": "pages/ProductDetails", "parentId": "components/layout/Layout", "path": "product/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/ProductDetails-D-TAFQR_.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/Breadcrumb-C-CyQQSx.js", "/assets/cn-DaoVIXo8.js", "/assets/x-D9PS03B8.js", "/assets/mapApiProduct-CrNg4m4Q.js", "/assets/chevron-right-CIgV92vm.js", "/assets/shield-check-BDn8nWOV.js", "/assets/check-CRDfOD-w.js", "/assets/quantity-stepper-BAJghPH1.js", "/assets/button-BLqxxX3x.js", "/assets/productToCartItem-DXbGcsr2.js", "/assets/useCart-BSAg613H.js", "/assets/truck-Bu-Q-MhJ.js", "/assets/clsx-B-dksMZM.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/index-Bh23Db3j.js", "/assets/cartSlice-DULQPWT4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/BundlesListing": { "id": "pages/BundlesListing", "parentId": "components/layout/Layout", "path": "bundles", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/BundlesListing-BpZjzhyA.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/Breadcrumb-C-CyQQSx.js", "/assets/select-B7yKCvVh.js", "/assets/button-BLqxxX3x.js", "/assets/check-CRDfOD-w.js", "/assets/shopping-cart-CgXQakMs.js", "/assets/shield-check-BDn8nWOV.js", "/assets/truck-Bu-Q-MhJ.js", "/assets/chevron-right-CIgV92vm.js", "/assets/cn-DaoVIXo8.js", "/assets/clsx-B-dksMZM.js", "/assets/index-k16Bg4dw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Cart": { "id": "pages/Cart", "parentId": "components/layout/Layout", "path": "cart", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Cart-CjNI_Q7T.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/quantity-stepper-BAJghPH1.js", "/assets/useCart-BSAg613H.js", "/assets/cn-DaoVIXo8.js", "/assets/button-BLqxxX3x.js", "/assets/cart-BfSeZl7W.js", "/assets/lock-CWgB8fwR.js", "/assets/shopping-cart-CgXQakMs.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/index-Bh23Db3j.js", "/assets/clsx-B-dksMZM.js", "/assets/cartSlice-DULQPWT4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/checkout/Shipping": { "id": "pages/checkout/Shipping", "parentId": "root", "path": "checkout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Shipping-CDpzJvcI.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/CheckoutHeader-WeK6g3U4.js", "/assets/CheckoutStepper-DpDHv56Y.js", "/assets/check-CRDfOD-w.js", "/assets/input-7tnMIZh9.js", "/assets/cn-DaoVIXo8.js", "/assets/select-B7yKCvVh.js", "/assets/checkbox-C2aZShy0.js", "/assets/checkout-DmZnAprj.js", "/assets/user-CAQUs_6u.js", "/assets/button-BLqxxX3x.js", "/assets/cart-BfSeZl7W.js", "/assets/arrow-right-fZWVfoXd.js", "/assets/shield-check-BDn8nWOV.js", "/assets/headphones-N5CR7p__.js", "/assets/useCart-BSAg613H.js", "/assets/VehicleContext-CICPek2g.js", "/assets/orders-0nxYQ86o.js", "/assets/checkoutSlice-B317Qt-P.js", "/assets/lock-CWgB8fwR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-k16Bg4dw.js", "/assets/index-Bh23Db3j.js", "/assets/cartSlice-DULQPWT4.js", "/assets/client-Fr3cYQ_G.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/checkout/Payment": { "id": "pages/checkout/Payment", "parentId": "root", "path": "checkout/payment", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Payment-V9K2LjTu.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/CheckoutHeader-WeK6g3U4.js", "/assets/CheckoutStepper-DpDHv56Y.js", "/assets/button-BLqxxX3x.js", "/assets/client-Fr3cYQ_G.js", "/assets/checkoutSlice-B317Qt-P.js", "/assets/checkout-DmZnAprj.js", "/assets/shield-check-BDn8nWOV.js", "/assets/lock-CWgB8fwR.js", "/assets/cn-DaoVIXo8.js", "/assets/clsx-B-dksMZM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/checkout/Confirmation": { "id": "pages/checkout/Confirmation", "parentId": "root", "path": "checkout/confirmation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Confirmation-ulIXxqAH.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/redux-toolkit.modern-CMjXyzB0.js", "/assets/CheckoutHeader-WeK6g3U4.js", "/assets/shield-check-BDn8nWOV.js", "/assets/check-CRDfOD-w.js", "/assets/cn-DaoVIXo8.js", "/assets/arrow-right-fZWVfoXd.js", "/assets/button-BLqxxX3x.js", "/assets/checkout-DmZnAprj.js", "/assets/shopping-cart-CgXQakMs.js", "/assets/truck-Bu-Q-MhJ.js", "/assets/chevron-right-CIgV92vm.js", "/assets/orders-0nxYQ86o.js", "/assets/client-Fr3cYQ_G.js", "/assets/cartSlice-DULQPWT4.js", "/assets/checkoutSlice-B317Qt-P.js", "/assets/triangle-alert-AKioyYYI.js", "/assets/lock-CWgB8fwR.js", "/assets/clsx-B-dksMZM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/checkout/Invoice": { "id": "pages/checkout/Invoice", "parentId": "root", "path": "checkout/invoice", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Invoice-CzK3Vx-w.js", "imports": ["/assets/jsx-runtime-BrqPdJ8F.js", "/assets/button-BLqxxX3x.js", "/assets/lock-CWgB8fwR.js", "/assets/cn-DaoVIXo8.js", "/assets/checkout-DmZnAprj.js", "/assets/orders-0nxYQ86o.js", "/assets/triangle-alert-AKioyYYI.js", "/assets/clsx-B-dksMZM.js", "/assets/client-Fr3cYQ_G.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-1ecc7e08.js", "version": "1ecc7e08", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "v8_passThroughRequests": false, "v8_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "components/layout/Layout": {
    id: "components/layout/Layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "pages/Home": {
    id: "pages/Home",
    parentId: "components/layout/Layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "pages/CategoriesGrid": {
    id: "pages/CategoriesGrid",
    parentId: "components/layout/Layout",
    path: "categories",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/ProductsListing": {
    id: "pages/ProductsListing",
    parentId: "components/layout/Layout",
    path: "shop/:categoryId?",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "pages/ProductDetails": {
    id: "pages/ProductDetails",
    parentId: "components/layout/Layout",
    path: "product/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "pages/BundlesListing": {
    id: "pages/BundlesListing",
    parentId: "components/layout/Layout",
    path: "bundles",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "pages/Cart": {
    id: "pages/Cart",
    parentId: "components/layout/Layout",
    path: "cart",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "pages/checkout/Shipping": {
    id: "pages/checkout/Shipping",
    parentId: "root",
    path: "checkout",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "pages/checkout/Payment": {
    id: "pages/checkout/Payment",
    parentId: "root",
    path: "checkout/payment",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "pages/checkout/Confirmation": {
    id: "pages/checkout/Confirmation",
    parentId: "root",
    path: "checkout/confirmation",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "pages/checkout/Invoice": {
    id: "pages/checkout/Invoice",
    parentId: "root",
    path: "checkout/invoice",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
