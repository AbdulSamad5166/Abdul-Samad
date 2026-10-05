function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {year} Reactpractice | Made with React + Vite</p>
    </footer>
  );
}

export default Footer;