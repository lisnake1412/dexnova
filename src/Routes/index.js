// import Home from "~/Pages/Home"
// import TradePage from "~/Pages/TradePage"
// import PoolsPage from "~/Pages/PoolsPage"
// import FarmsPage from "~/Pages/FarmsPage"
 const publicRoutes = [
    { path:'/', component: 0 },
    { path:'/trade', component: 0 },
    { path:'/pools', component: 0  },
    { path:'/farms', component: 0 },
    { path:'/bridge', component: 0, url:'https://app.rhino.fi/bridge?token=ETH&chainOut=LINEA&chain=ETHEREUM' },
    { path:'/docs', component: 0, url:'https://docs.ancora.finance/introduce/ancora-finance-intro' },

]

const privateRoutes = [

]

export { publicRoutes, privateRoutes}