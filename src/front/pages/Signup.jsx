import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login submitted:', formData);


        if (formData.password != formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }


        try {
            const res = await fetch(`${backendUrl}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            let result;
            try {
                result = await res.json();
            } catch {
                result = { msg: "Unexpected server error" };
            }
            if (res.ok) {
                console.log(result)
                alert(result.msg)
                setTimeout(() => navigate("/login"), 1000);
            } else {
                alert(result.msg)
            }
        } catch (err) {
            alert('error al realizar la peticion')
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <div className="container mt-5" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="confirm password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Signup;