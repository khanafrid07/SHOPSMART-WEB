# ShopSmart E-commerce Platform



 
## TECH USED:
-MERN
-TAILWIND.CSS
-JAVASCRIPT,
-REDUX RTK QUERY
-motion-framer
daisy ui


`
```


```

```
e-commerce-Full-Stack-main
├─ Backend
│  ├─ config
│  │  ├─ db.js
│  │  ├─ multer.js
│  │  ├─ seedProducts.js
│  │  └─ stripe.js
│  ├─ middlewares
│  │  ├─ expressError.js
│  │  ├─ validate.js
│  │  ├─ verifyUser.js
│  │  └─ wrapAsync.js
│  ├─ models
│  │  ├─ banner.js
│  │  ├─ cart.js
│  │  ├─ order.js
│  │  ├─ product.js
│  │  ├─ review.js
│  │  ├─ tempUser.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ authRoutes.js
│  │  ├─ bannerRoutes.js
│  │  ├─ cartRoutes.js
│  │  ├─ dashboardRoute.js
│  │  ├─ orderRoute.js
│  │  ├─ paymentRoute.js
│  │  ├─ productRoutes.js
│  │  └─ reviewRoutes.js
│  ├─ server.js
│  └─ utils
│     ├─ nodemail.js
│     └─ skuGenerator.js
├─ Frontend
│  └─ e-commerce
│     ├─ dist
│     │  ├─ assets
│     │  │  ├─ Accessories-Bm97QWd2.png
│     │  │  ├─ accessoriesBanner-CDPk-G7y.png
│     │  │  ├─ bannerFashion-DM0wiG4A.png
│     │  │  ├─ Beauty-DSrcjO1X.png
│     │  │  ├─ beautyBanner-x-vUt3Dw.png
│     │  │  ├─ Fashion-BKJ_AFhO.png
│     │  │  ├─ Footwear-CiBCNaG6.png
│     │  │  ├─ footwearBanner-BWO5u4CQ.webp
│     │  │  ├─ hero-DiLIfwCE.png
│     │  │  ├─ index-CMcIwO5T.js
│     │  │  └─ index-DTji0vXi.css
│     │  ├─ index.html
│     │  └─ vite.svg
│     ├─ eslint.config.js
│     ├─ index.html
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ postcss.config.js
│     ├─ public
│     │  └─ vite.svg
│     ├─ README.md
│     ├─ src
│     │  ├─ app
│     │  │  └─ store.js
│     │  ├─ App.jsx
│     │  ├─ assets
│     │  │  ├─ 8277025.png
│     │  │  ├─ Accessories.png
│     │  │  ├─ accessoriesBanner.png
│     │  │  ├─ bannerFashion.png
│     │  │  ├─ Beauty.png
│     │  │  ├─ beautyBanner.png
│     │  │  ├─ cleanser.png
│     │  │  ├─ facebook.svg
│     │  │  ├─ Fashion
│     │  │  │  ├─ dresses.jpg
│     │  │  │  ├─ hoodies.jpg
│     │  │  │  ├─ jackets.jpg
│     │  │  │  ├─ jeans.jpg
│     │  │  │  ├─ tops.jpg
│     │  │  │  ├─ tshirt.jpg
│     │  │  │  ├─ womenJacket.jpg
│     │  │  │  └─ womenJeans.jpg
│     │  │  ├─ Fashion.png
│     │  │  ├─ fashionB.png
│     │  │  ├─ fashionBanner.png
│     │  │  ├─ fashionbannerr.png
│     │  │  ├─ Footwear.png
│     │  │  ├─ footwearBanner.webp
│     │  │  ├─ hero.png
│     │  │  ├─ instagram.svg
│     │  │  ├─ landingBanner_1.png
│     │  │  ├─ linkedin.svg
│     │  │  ├─ menAccessory.png
│     │  │  ├─ menFashion.png
│     │  │  ├─ person.png
│     │  │  ├─ react.svg
│     │  │  ├─ shoes.png
│     │  │  ├─ watch.webp
│     │  │  ├─ woman.png
│     │  │  ├─ womenAccessory.webp
│     │  │  ├─ womensFashion.png
│     │  │  └─ x.svg
│     │  ├─ components
│     │  │  ├─ Alert.jsx
│     │  │  ├─ common
│     │  │  │  ├─ EmptyState.jsx
│     │  │  │  └─ ProtectedRote.jsx
│     │  │  ├─ ScrollToTop.jsx
│     │  │  ├─ sections
│     │  │  │  ├─ CategorySection.jsx
│     │  │  │  ├─ DiscoverCollection.jsx
│     │  │  │  ├─ FashionCollection.jsx
│     │  │  │  ├─ Hero.jsx
│     │  │  │  └─ OfferSignup.jsx
│     │  │  ├─ shared
│     │  │  └─ skeletons
│     │  │     └─ BannerSkeleton.jsx
│     │  ├─ features
│     │  │  ├─ auth
│     │  │  │  ├─ authSlice.js
│     │  │  │  ├─ GoogleLoginButton.jsx
│     │  │  │  ├─ Login.jsx
│     │  │  │  ├─ LoginForm.jsx
│     │  │  │  ├─ OtpPage.jsx
│     │  │  │  └─ RegisterForm.jsx
│     │  │  ├─ Banners
│     │  │  │  ├─ BannerSlice.js
│     │  │  │  ├─ components
│     │  │  │  │  ├─ BannerCarousel.jsx
│     │  │  │  │  ├─ BannerData.jsx
│     │  │  │  │  ├─ BannerFilter.jsx
│     │  │  │  │  ├─ BannerRenderer.jsx
│     │  │  │  │  ├─ BannerSchedule.jsx
│     │  │  │  │  └─ BannerSlot.jsx
│     │  │  │  ├─ form
│     │  │  │  │  ├─ BannerForm.jsx
│     │  │  │  │  └─ BannerFormFields.jsx
│     │  │  │  └─ templates
│     │  │  │     ├─ CenterMinimal.jsx
│     │  │  │     ├─ CleanImage.jsx
│     │  │  │     ├─ GradientPromo.jsx
│     │  │  │     ├─ HeroDark.jsx
│     │  │  │     ├─ LeftOverlay.jsx
│     │  │  │     └─ SplitBanner.jsx
│     │  │  ├─ cart
│     │  │  │  ├─ cart.js
│     │  │  │  ├─ Cart.jsx
│     │  │  │  ├─ CartSummary.jsx
│     │  │  │  └─ CartUpdate.jsx
│     │  │  ├─ Dashboard
│     │  │  │  ├─ dashboardSlice.js
│     │  │  │  └─ shared
│     │  │  │     ├─ FilterDropdown.jsx
│     │  │  │     └─ SearchInput.jsx
│     │  │  ├─ orders
│     │  │  │  ├─ admin
│     │  │  │  │  └─ components
│     │  │  │  │     ├─ OrderData.jsx
│     │  │  │  │     ├─ OrderFilter.jsx
│     │  │  │  │     ├─ OrderList.jsx
│     │  │  │  │     └─ StatusController.jsx
│     │  │  │  ├─ orderSlice.js
│     │  │  │  └─ user
│     │  │  │     └─ components
│     │  │  │        ├─ OrderAddress.jsx
│     │  │  │        ├─ OrderDetails.jsx
│     │  │  │        ├─ OrderItems.jsx
│     │  │  │        ├─ OrderStatusBadge.jsx
│     │  │  │        ├─ OrderSummary.jsx
│     │  │  │        └─ OrderTimeline.jsx
│     │  │  └─ products
│     │  │     ├─ category
│     │  │     │  ├─ Accessories
│     │  │     │  │  ├─ AccessoriesCategories.jsx
│     │  │     │  │  └─ AccessoriesHero.jsx
│     │  │     │  ├─ AccessoriesSection.jsx
│     │  │     │  ├─ Beauty
│     │  │     │  │  ├─ Category.jsx
│     │  │     │  │  ├─ ShopConcern.jsx
│     │  │     │  │  └─ Skincare.jsx
│     │  │     │  ├─ BeautySection.jsx
│     │  │     │  ├─ CateogryFilter.jsx
│     │  │     │  ├─ Fashion
│     │  │     │  │  ├─ CategoryCard.jsx
│     │  │     │  │  ├─ FashionTab.jsx
│     │  │     │  │  └─ GenderPanel.jsx
│     │  │     │  ├─ FashionSection.jsx
│     │  │     │  └─ FootwearSection.jsx
│     │  │     ├─ components
│     │  │     │  ├─ DiscountItem.jsx
│     │  │     │  ├─ filterConfig.js
│     │  │     │  ├─ FilterItem.jsx
│     │  │     │  ├─ FilterSection.jsx
│     │  │     │  ├─ FilterSidebar.jsx
│     │  │     │  ├─ LandingCard.jsx
│     │  │     │  ├─ ProductCard.jsx
│     │  │     │  └─ ProductListing.jsx
│     │  │     ├─ config
│     │  │     │  ├─ categoryConfig.js
│     │  │     │  └─ variantConfig.js
│     │  │     ├─ details
│     │  │     │  ├─ CartAndPrice.jsx
│     │  │     │  ├─ ProductDetail.jsx
│     │  │     │  ├─ ProductImageGallery.jsx
│     │  │     │  ├─ ProductInfo.jsx
│     │  │     │  ├─ ProductVariants.jsx
│     │  │     │  └─ Reviews.jsx
│     │  │     ├─ form
│     │  │     │  ├─ GeneralInfo.jsx
│     │  │     │  ├─ ImageUploader.jsx
│     │  │     │  ├─ ProductForm.jsx
│     │  │     │  ├─ ProductsStats.jsx
│     │  │     │  ├─ VariantAdder.jsx
│     │  │     │  ├─ VariantsSection.jsx
│     │  │     │  └─ VisibilitySection.jsx
│     │  │     ├─ productSlice.js
│     │  │     ├─ reviews
│     │  │     │  ├─ AverageRating.jsx
│     │  │     │  ├─ Reviews.jsx
│     │  │     │  └─ reviewSlice.js
│     │  │     ├─ section
│     │  │     │  ├─ FeaturedProduct.jsx
│     │  │     │  ├─ NewArrivals.jsx
│     │  │     │  ├─ ScrollToSection.jsx
│     │  │     │  ├─ SuggestedProduct.jsx
│     │  │     │  ├─ TrendingProducts.jsx
│     │  │     │  └─ ViewedProduct.jsx
│     │  │     └─ TrustBadges.jsx
│     │  ├─ hooks
│     │  │  ├─ useDashboardStats.jsx
│     │  │  ├─ useProductForm.jsx
│     │  │  ├─ useSearchDebounce.jsx
│     │  │  └─ useTypingEffect.jsx
│     │  ├─ index.css
│     │  ├─ layout
│     │  │  ├─ components
│     │  │  │  ├─ DashboardNav.jsx
│     │  │  │  ├─ Footer.jsx
│     │  │  │  ├─ Navbar.jsx
│     │  │  │  └─ Sidebar.jsx
│     │  │  ├─ DashboardLayout.jsx
│     │  │  └─ UserLayout.jsx
│     │  ├─ main.jsx
│     │  ├─ Pages
│     │  │  ├─ admin
│     │  │  │  ├─ AdminOrder.jsx
│     │  │  │  ├─ BannerManagement.jsx
│     │  │  │  ├─ DashboardHome.jsx
│     │  │  │  └─ ManageProducts.jsx
│     │  │  ├─ public
│     │  │  │  └─ Home.jsx
│     │  │  └─ user
│     │  │     ├─ Checkout.jsx
│     │  │     ├─ Payment.jsx
│     │  │     ├─ Profile.jsx
│     │  │     ├─ UserOrder.jsx
│     │  │     └─ Wishlist.jsx
│     │  └─ utils
│     │     └─ notify.js
│     ├─ tailwind.config.js
│     └─ vite.config.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ Shared
   └─ Schema
      ├─ ProductSchema.js
      └─ reviewSchema.js

```
