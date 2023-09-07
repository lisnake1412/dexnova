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
import Header from 'components/Header'
import Footer from 'components/Footer'

const Swap = React.lazy(() => import('pages/swap'))
const AddLiquidity = React.lazy(() => import('pages/add'))
const LaunchpadS1 = React.lazy(() => import('pages/launchpads1'))
const LaunchpadS2 = React.lazy(() => import('pages/launchpads2'))
const Pools = React.lazy(() => import('pages/pool'))
const Farms = React.lazy(() => import('pages/farm'))

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
            <Header />
            <Suspense fallback={''}>
                <AppContainer>
                    <ToastMessage />
                    <Routes>
                        <Route path="/swap" element={<Swap />} />
                        <Route path="/pools" element={<Farms />} />
                        <Route path="/add" element={<AddLiquidity />} />
                        <Route path="/add/:token0/:token1" element={<AddLiquidity />} />
                        <Route path="/private_sale" element={<LaunchpadS1 />} />
                        <Route path="/public_sale" element={<LaunchpadS2 />} />
                        <Route path="/position" element={<Pools />} />
                        <Route path="/farms" element={<Farms />} />
                        <Route path="*" element={<Navigate to="/swap" />} />
                    </Routes>
                </AppContainer>
            </Suspense>
            <Footer />
        </HashRouter>
    )
}

const AppContainer = styled.div`
    position: relative;
    padding: 20px 0;
    min-height: calc(100vh - 345px);
`

export default App
