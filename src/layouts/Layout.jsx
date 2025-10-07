// src/layouts/Layout.jsx
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Menu, X, Home, List, Settings, ArrowLeft
} from "lucide-react";
import styles from "./Layout.module.scss";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(() => {
    // préférences utilisateur (false par défaut)
    const v = localStorage.getItem("sidebarOpen");
    return v === "true";
  });

  const toggle = () => {
    setOpen((v) => {
      localStorage.setItem("sidebarOpen", String(!v));
      return !v;
    });
  };

  // Option UX : refermer la sidebar quand on change de page
  useEffect(() => {
    if (open) {
      setOpen(false);
      localStorage.setItem("sidebarOpen", "false");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      {/* bouton flottant d’ouverture */}
      <button
        className={styles.toggleBtn}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="app-sidebar"
        onClick={toggle}
      >
        <Menu size={20} />
      </button>

      {/* overlay */}
      {open && <div className={styles.overlay} onClick={toggle} />}

      {/* SIDEBAR */}
      <aside
        id="app-sidebar"
        className={`${styles.sidebar} ${open ? styles.open : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>cTrader Journal</div>
          <button className={styles.closeBtn} aria-label="Fermer le menu" onClick={toggle}>
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/" end className={({isActive}) => isActive ? styles.active : undefined}>
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/trades" className={({isActive}) => isActive ? styles.active : undefined}>
            <List size={18} />
            <span>Trades</span>
          </NavLink>

          <NavLink to="/settings" className={({isActive}) => isActive ? styles.active : undefined}>
            <Settings size={18} />
            <span>Paramètres</span>
          </NavLink>

          {/* RETOUR intégré dans la sidebar */}
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate(-1)}
            title="Revenir à la page précédente"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
        </nav>
      </aside>

      {/* CONTENU */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
