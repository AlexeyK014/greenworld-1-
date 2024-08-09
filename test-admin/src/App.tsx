import { Admin } from "react-admin";
import { authProvider } from "./authProvider";

export const App = () => <Admin authProvider={authProvider}></Admin>;
