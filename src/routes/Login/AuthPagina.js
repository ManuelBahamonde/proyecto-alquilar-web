import AuthForm from "components/auth/AuthForm";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "storage/auth-context";

const AuthPagina = () => {
  const authCtx = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      // Redirecting
      let urlToRedirect = searchParams.get('to');

      if (!urlToRedirect) urlToRedirect = '/';

      navigate(urlToRedirect);
    }
  }, [authCtx.isLoggedIn, searchParams, navigate]);

  return <AuthForm />;
};

export default AuthPagina;
