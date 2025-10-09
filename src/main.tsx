import "./index.css"
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Providers } from "./Providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const router = createRouter({
    routeTree,
    context: {
        token: localStorage.getItem("tk"),
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }

    interface HistoryState {
        email?: string;
    }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <Providers>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </Providers>
        </StrictMode>
    );
}

