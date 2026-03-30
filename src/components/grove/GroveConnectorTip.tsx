import { useState, useEffect } from 'react';

/**
 * Grove 커넥터 안내 정보 카드
 * 접이식(토글) 형태로, 클릭하면 Grove 커넥터에 대한 설명을 보여줍니다.
 */
export default function GroveConnectorTip() {
  const [isOpen, setIsOpen] = useState(false);

  // 테마 감지
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${isDark ? 'rgba(78, 205, 196, 0.3)' : '#a8e6cf'}`,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#e8faf4',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 540,
      }}
    >
      {/* 헤더 (항상 표시) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="grove-connector-tip-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 14px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: isDark ? '#4ECDC4' : '#1a6b52',
          textAlign: 'left',
        }}
      >
        {/* 정보 아이콘 */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: '#4ECDC4',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          i
        </span>
        <span>Grove 커넥터란?</span>
        {/* 화살표 */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            marginLeft: 'auto',
            transition: 'transform 0.25s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M4 6l4 4 4-4" stroke={isDark ? '#4ECDC4' : '#1a6b52'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 내용 (토글) */}
      <div
        id="grove-connector-tip-content"
        style={{
          maxHeight: isOpen ? 300 : 0,
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.25s ease',
        }}
      >
        <div
          style={{
            padding: '0 14px 14px 14px',
            fontSize: 13,
            lineHeight: 1.7,
            color: isDark ? '#cbd5e1' : '#2d6a56',
          }}
        >
          <p style={{ margin: '0 0 8px 0' }}>
            Grove 커넥터는 <strong>4핀 규격</strong>으로, 방향이 정해져 있어
            잘못 꽂을 걱정이 없습니다. 초보자도 납땜 없이 케이블을 꽂기만 하면
            센서와 보드를 연결할 수 있습니다.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 600, color: isDark ? '#4ECDC4' : '#1a6b52' }}>4개 핀 구성</span>
              <span>SIG, NC(또는 SIG2), VCC, GND</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 600, color: isDark ? '#4ECDC4' : '#1a6b52' }}>케이블 규격</span>
              <span>표준 4핀 Grove 케이블 (양쪽 커넥터)</span>
            </div>
          </div>

          {/* 간단한 커넥터 일러스트 */}
          <svg viewBox="0 0 200 48" style={{ width: '100%', maxWidth: 200, marginTop: 10 }}>
            {/* 커넥터 몸체 */}
            <rect x={30} y={8} width={140} height={32} rx={4} fill="#4ECDC4" opacity={0.2} stroke="#4ECDC4" strokeWidth={1} />
            {/* 4핀 */}
            {[
              { cx: 62, label: 'SIG' },
              { cx: 87, label: 'NC' },
              { cx: 112, label: 'VCC' },
              { cx: 137, label: 'GND' },
            ].map(({ cx, label }) => (
              <g key={label}>
                <circle cx={cx} cy={20} r={5} fill="#4ECDC4" />
                <text x={cx} y={38} textAnchor="middle" fontSize={7} fill={isDark ? '#94a3b8' : '#2d6a56'} fontFamily="system-ui, sans-serif" fontWeight={500}>
                  {label}
                </text>
              </g>
            ))}
            {/* 방향 표시 화살표 */}
            <polygon points="22,24 30,18 30,30" fill="#4ECDC4" opacity={0.6} />
          </svg>
        </div>
      </div>
    </div>
  );
}
