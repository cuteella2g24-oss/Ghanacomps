export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-brand">
          <img src="/assets/logo.jpg" alt="" className="foot-logo" />
          <span className="foot-name">Ghana <em>Comps</em></span>
        </div>
        <p className="foot-tag">"Every goal. Every assist. Every legend.<br />Seen and Celebrated." 🇬🇭</p>
        <div className="foot-links">
          <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">@Ghanacomps on X</a>
          <a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener">@ghanacompss on TikTok</a>
          <a href="https://www.facebook.com/share/1GL7b1Qsuq/" target="_blank" rel="noopener">Ghana Comps on Facebook</a>
          <a href="mailto:compsghana@gmail.com">compsghana@gmail.com</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Ghana Comps. All Rights Reserved.</span>
        <span>Made for the culture. Built for the game.</span>
      </div>
    </footer>
  );
}
