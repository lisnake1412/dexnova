import React, { Suspense } from 'react'
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import styled from 'styled-components'
import SwapUpdater from 'states/swap/updater'
import MintUpdater from 'states/mint/updater'
import AppUpdater from 'states/application/updater'
import MulticallUpdater from 'states/multicall/updater'
import ListUpdater from 'states/lists/updater'
import Polling from 'components/Polling'
import ToastMessage from 'components/ToastMessage'
import Header from 'components/HeaderV2'
import Footer from 'components/Footer'
import HomePage from 'pages/HomePage'
import NetworkSelector from 'components/NetworkSelectorV2'

const Swap = React.lazy(() => import('pages/swap'))
const AddLiquidity = React.lazy(() => import('pages/add'))
const LaunchpadS1 = React.lazy(() => import('pages/launchpads1'))
const LaunchpadS2 = React.lazy(() => import('pages/launchpads2'))
const Pools = React.lazy(() => import('pages/pool'))
const Farms = React.lazy(() => import('pages/farm'))
const Nft = React.lazy(() => import('pages/nft'))
const Comingsoon = React.lazy(() => import('pages/ComingSoon'))

const App = () => {
    const Updater = () => {
        return (
            <>
                <SwapUpdater />
                <MintUpdater />
                <AppUpdater />
                <MulticallUpdater />
                <ListUpdater />
            </>
        )
    }

    return (
        <HashRouter>
            <Updater />
            
            <Suspense fallback={''}>
                <AppContainer>
                    <ToastMessage />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/swap" element={<Swap />} />
                        <Route path="/trade" element={<Swap />} />             
                        <Route path="/pools" element={<Farms />} />
                        <Route path="/add" element={<AddLiquidity />} />
                        <Route path="/add/:token0/:token1" element={<AddLiquidity />} />
                        <Route path="/private_sale" element={<LaunchpadS1 />} />
                        <Route path="/public_sale" element={<LaunchpadS2 />} />
                        <Route path="/position" element={<Pools />} />
                        <Route path="/farms" element={<Farms />} />
                        <Route path="/nft" element={<Nft />} />
                        <Route path="/comingsoon" element={<Comingsoon />} />
                        <Route path="*" element={<Navigate to="/swap" />} />
                    </Routes>
                    <NetworkSelector/>
                </AppContainer>
            </Suspense>
        </HashRouter>
    )
}

const AppContainer = styled.div`
    position: relative;
`

export default App
