import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Menu, X, User, Package, Heart, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

import { notifyError, notifySuccess } from "../../utils/notify";
import Modal from "../../components/common/Modal";
import { useGetCartQuery } from "../../features/cart/cart";
export default function Navbar({ wishCount = 0 }) {
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetCartQuery({ count: true }, { skip: !user, refetchOnMountOrArgChange: true });
  const cartCounts = data?.count || 0;

  // const [cartCounts, setCartCounts] = useState(0)
  // useEffect(() => {
  //   setCartCounts(cartCount)
  // }, [cartCount])

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);


  const menuList = [
    { name: "Profile", icon: <User size={15} />, link: "/profile" },
    { name: "My Orders", icon: <Package size={15} />, link: "/orders" },
    { name: "Wishlist", icon: <Heart size={15} />, link: "/wishlist" },
  ];

  (searchQuery)
  useEffect(() => {
    setMenuOpen(false); setMobileOpen(false);
    setShowSugg(false); setSearchQuery("");
  }, [location]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(searchQuery)}`);
        const d = await r.json();
        setSuggestions(d.allProducts || []);
      } catch { }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function goSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(""); setShowSugg(false);
  }
  const handleLogout = async () => {

    try {
      dispatch(logout());
      notifySuccess("Logged out successfully");
      navigate("/");
    } catch (err) {
      notifyError(err.message);
    }



  }

  return (
    <>

      <nav className={`fixed top-0 left-0 right-0 z-10 border-b transition-all z-[100] duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
        }`}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-2 flex items-center gap-4 justify-between min-w-0">
          {/* Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="sm:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center text-2xl font-black tracking-tight select-none">
              <span className="w-10 h-10 mr-2 hidden sm:block"><img src="/logo.png" alt="logo" /></span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Shop</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-600">Smart</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg relative" ref={searchRef}>
            <form onSubmit={goSearch} className="relative group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors pointer-events-none"
                size={16}
              />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSugg(true); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none text-sm font-medium transition-all"
                placeholder="Search premium products..."
              />
            </form>
            {/* Search suggestions */}
            {showSugg && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 max-h-72 overflow-y-auto z-50">
                {suggestions.map((p) => (
                  <div
                    key={p._id}
                    onMouseDown={() => { navigate(`/products/${p.slug}-${p._id}`); setSearchQuery(""); setShowSugg(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {p.images?.[0] && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                      <p className="text-xs font-bold text-purple-500">{p.basePrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Cart */}
            <Link to="/cart" className="relative group  sm:flex">
              <ShoppingCart className="text-gray-600 group-hover:text-pink-500 transition-colors" size={34} />
              {cartCounts > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  {cartCounts}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative hidden sm:flex" ref={profileRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold text-base flex items-center justify-center shadow-md hover:ring-2 hover:ring-purple-200 transition-all active:scale-95"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </button>

                {menuOpen && (
                  <div className="absolute top-[calc(100%+10px)] right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs font-medium text-gray-500 truncate">{user.email}</p>
                    </div>
                    {menuList.map((item, i) => (
                      <Link
                        key={i}
                        to={item.link}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        <span className="text-gray-400">{item.icon}</span>
                        {item.name}
                        {item.name === "Wishlist" && wishCount > 0 && (
                          <span className="ml-auto text-xs font-bold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">{wishCount}</span>
                        )}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} className="text-red-400" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-bold bg-gray-900 text-white rounded-full hover:bg-purple-600 hover:shadow-md transition-all active:scale-95">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden px-4 py-1 relative" ref={searchRef}>
          <form onSubmit={goSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSugg(true); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-400 focus:bg-white outline-none text-sm font-medium transition-all"
              placeholder="Search products..."
            />
          </form>
          {showSugg && suggestions.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 max-h-56 overflow-y-auto z-50">
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  onMouseDown={() => { navigate(`/products/${p.slug}-${p._id}`); setSearchQuery(""); setShowSugg(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded shrink-0 bg-gray-100 overflow-hidden">
                    {p.images?.[0] && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 truncate">{p.title}</span>

                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer — pushes page content below the fixed navbar */}
      <div className="h-[72px] md:h-[64px]" />

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99999] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[82%] max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-baseline text-xl font-black">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Shop</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-600">Smart</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full bg-gray-100 text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3.5 rounded-xl font-bold text-gray-800 hover:bg-gray-50">Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-4 py-3.5 rounded-xl font-bold text-gray-800 hover:bg-gray-50">All Products</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-gray-800 hover:bg-gray-50">
                Cart {cartCounts > 0 && <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{cartCounts}</span>}
              </Link>
              {user && (<>
                <div className="my-3 h-px bg-gray-100" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Account</p>
                {menuList.map((item, i) => (
                  <Link key={i} to={item.link} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-gray-800 hover:bg-purple-50 hover:text-purple-600">
                    <span className="text-gray-400">{item.icon}</span>{item.name}
                  </Link>
                ))}
              </>)}
            </div>

            <div className="p-4 border-t border-gray-100">
              {user ? (
                <div>
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-lg shadow">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-colors">
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex justify-center py-3 rounded-xl font-bold text-gray-700 bg-gray-100">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex justify-center py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-purple-600 transition-colors">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}