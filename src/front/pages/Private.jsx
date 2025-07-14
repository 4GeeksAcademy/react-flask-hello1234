import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Private = () => {

    const navigate = useNavigate();

    let cerrarSesion = () => {
        console.log('cerro');
        sessionStorage.removeItem("User");
        sessionStorage.removeItem("TOKEN");
        navigate("/");
    }

    useEffect(() => {
        console.log('cargo pagina');

        let token = sessionStorage.getItem("TOKEN");
        if (token == null) {
            navigate("/login");
        }
        console.log(token);
    }, [])

    return (
        <div>
            <h1>Private</h1>

            <button className="btn btn-danger ms-3" onClick={cerrarSesion}>Cerrar sesion</button>
        </div>
    )
}

export default Private;