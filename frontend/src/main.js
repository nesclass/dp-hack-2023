import "./global.css";
import "carbon-components-svelte/css/g10.css";
import "@carbon/styles/css/styles.css";
import "@carbon/charts/styles.css";
import HMR from "@roxi/routify/hmr";
import App from "./App.svelte";

const app = HMR(App, { target: document.body }, "app");

export default app;
