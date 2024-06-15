import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import NotFound from "./pages/notfound/NotFound.jsx";
import Home from "./pages/home/Home.jsx";

const routes = [
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "*",
        element: <NotFound/>
    }
];

const router = createBrowserRouter(routes);

function App() {
    return <RouterProvider router={router}/>;
}

export default App
