/**
 * Decorative silhouette of the Maputo–Katembe cable-stayed bridge and the
 * city skyline, reproducing the reference hero background as scalable,
 * text-free vector art (the source mockup has the title baked into the
 * same pixels as the bridge photo, so a raster crop can't be reused here).
 */
export function MaputoSkyline() {
  return (
    <svg
      className="hero-skyline"
      viewBox="0 0 1600 500"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="hero-skyline__buildings">
        <rect x="1020" y="360" width="26" height="90" />
        <rect x="1050" y="330" width="34" height="120" />
        <rect x="1088" y="370" width="22" height="80" />
        <rect x="1114" y="345" width="28" height="105" />
        <rect x="1146" y="385" width="20" height="65" />
        <rect x="1170" y="320" width="30" height="130" />
        <rect x="1204" y="360" width="24" height="90" />
        <rect x="1232" y="340" width="26" height="110" />
        <rect x="1262" y="375" width="18" height="75" />
        <rect x="1284" y="355" width="30" height="95" />
        <rect x="1318" y="390" width="22" height="60" />
        <rect x="1344" y="330" width="28" height="120" />
        <rect x="1376" y="365" width="20" height="85" />
        <rect x="1400" y="345" width="26" height="105" />
        <rect x="1430" y="380" width="24" height="70" />
        <rect x="1458" y="360" width="18" height="90" />
        <rect x="1480" y="335" width="28" height="115" />
        <rect x="1512" y="370" width="22" height="80" />
        <rect x="1538" y="350" width="26" height="100" />
        <rect x="1568" y="385" width="20" height="65" />
      </g>
      <g
        className="hero-skyline__bridge"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M760 450 L760 130" strokeWidth="10" />
        <path d="M700 165 L820 165" strokeWidth="8" />
        {[
          [640, 450], [665, 450], [690, 450], [715, 450],
          [845, 450], [870, 450], [895, 450], [920, 450],
        ].map(([x, y], i) => (
          <path
            key={i}
            d={`M760 ${i < 4 ? 175 : 165} L${x} ${y}`}
            strokeWidth="3"
          />
        ))}
        <path d="M560 450 C 620 400, 900 400, 960 450" strokeWidth="6" />
      </g>
    </svg>
  );
}
