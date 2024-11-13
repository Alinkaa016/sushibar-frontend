import React from 'react';
import {config, useTransition} from 'react-spring';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import './transitions.css';
import {AnimatePresence, motion} from 'framer-motion';

const AnimatedRoutes = () => {
    const location = useLocation();

    const transitions = useTransition(location, {
        from: {opacity: 0, transform: 'translate3d(10%,0,0)'},
        enter: {opacity: 1, transform: 'translate3d(0%,0,0)'},
        leave: {opacity: 0, transform: 'translate3d(-10%,0,0)'},

        config: config.stiff
    });

    const pageTransition = {
        initial: {opacity: 0},
        animate: {opacity: 1},
        exit: {opacity: 0},
        transition: {duration: 0.3, delay: 0}
    };

    return (
        <>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<motion.div {...pageTransition}><HomePage/></motion.div>}/>
                    <Route path="/login" element={<motion.div {...pageTransition}><LoginPage/></motion.div>}/>
                    <Route path="/register" element={<motion.div {...pageTransition}><RegisterPage/></motion.div>}/>
                </Routes>
            </AnimatePresence>
        </>
    )
};

const AppRouter = () => {
    return (
        <Router>
            <AnimatedRoutes/>
        </Router>
    );
};


export default AppRouter;
