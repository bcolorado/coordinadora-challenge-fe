import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for jsdom / react-router
Object.assign(global, { TextEncoder, TextDecoder });
