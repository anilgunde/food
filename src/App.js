import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { ToastContainer } from "react-toastify";
import HandleRoutes from "./Routes/HandleRoutes";
import { CookiesProvider } from "react-cookie";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng: "ar",
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/{{lng}}/translation.json",
    },
    react: {
      useSuspense: false,
    },
  });
const App = () => {
  const lang = sessionStorage.getItem('lang')
  return (
    <>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
    
      <ToastContainer
        rtl={lang==='ar'?true:false}
        closeOnClick={true}
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
      />
      <HandleRoutes />
      </CookiesProvider>
    </>
  );
};

export default App;
