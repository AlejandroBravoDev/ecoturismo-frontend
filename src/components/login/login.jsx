import React, { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import img3 from "../../assets/img3.webp";
import img4 from "../../assets/img4.webp";
import img5 from "../../assets/img5.webp";
import img6 from "../../assets/img6.webp";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderImages = [img1, img2, img3, img4, img5, img6];
  const totalImages = sliderImages.length;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login", formData);
      const token = res.data.token; // Corregido de access_token a token
      const usuario = res.data.usuario; // Obtener el objeto usuario
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario)); // Guardar usuario
      setMensaje(res.data.message); // Corregido de mensaje a message
      setFormData({ email: "", password: "" });
      setTimeout(() => {
        if (usuario.rol === "admin") {
          navigate("/");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("Error en login:", err);
      const errorMsg =
        err.response?.data?.message ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";
      setMensaje(errorMsg);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === totalImages - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [totalImages]);

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <div className={styles.sliderTrack}>
          {sliderImages.map((imgSrc, index) => (
            <div
              key={index}
              className={`${styles.sliderItem} ${
                index === currentIndex ? styles.active : ""
              }`}
            >
              <img src={imgSrc} alt={`Slider image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.formBox}>
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <label>Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Iniciar sesión</button>
          </form>

          {mensaje && <p className={styles.mensaje}>{mensaje}</p>}

          <p className={styles.loginText}>¿No tienes cuenta?</p>
          <a href="/registro" className={styles.loginLink}>
            Ir a registro
          </a>

          <Link to="/forgot-password" className={styles.loginLink}>
            ¿Olvidaste tu contraseña?
          </Link>

          <Link to="/">
            <p className="text-gray-500">Volver al inicio</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
