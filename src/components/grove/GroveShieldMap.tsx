import { useState, type CSSProperties } from 'react';

// === 타입 정의 ===

interface PortInfo {
  name: string;
  type: '아날로그' | '디지털' | 'I2C' | 'UART';
  gpio: string;
  color: string;
  sensorExamples: string;
}

interface ConnectedSensor {
  port: string;
  sensorName: string;
}

interface GroveShieldMapProps {
  activePort?: string;
  connectedSensors?: ConnectedSensor[];
  onPortClick?: (port: PortInfo) => void;
  className?: string;
}

// === 포트 데이터 ===

const PORTS: PortInfo[] = [
  // 아날로그
  { name: 'A0', type: '아날로그', gpio: 'GP26', color: '#22c55e', sensorExamples: '빛 센서, 토양수분 센서' },
  { name: 'A1', type: '아날로그', gpio: 'GP27', color: '#22c55e', sensorExamples: '사운드 센서, 가스 센서' },
  { name: 'A2', type: '아날로그', gpio: 'GP28', color: '#22c55e', sensorExamples: '온도 센서, 회전 가변저항' },
  // 디지털
  { name: 'D16', type: '디지털', gpio: 'GP16/GP17', color: '#3b82f6', sensorExamples: '버튼, LED' },
  { name: 'D18', type: '디지털', gpio: 'GP18/GP19', color: '#3b82f6', sensorExamples: '초음파 센서, 릴레이' },
  { name: 'D20', type: '디지털', gpio: 'GP20/GP21', color: '#3b82f6', sensorExamples: '부저, 모션 센서' },
  // I2C
  { name: 'I2C0', type: 'I2C', gpio: 'GP8/GP9', color: '#eab308', sensorExamples: '가속도 센서, 컬러 센서' },
  { name: 'I2C1', type: 'I2C', gpio: 'GP6/GP7', color: '#eab308', sensorExamples: 'OLED 디스플레이, BME280' },
  // UART
  { name: 'UART0', type: 'UART', gpio: 'GP0/GP1', color: '#a855f7', sensorExamples: 'GPS 모듈, 블루투스 모듈' },
  { name: 'UART1', type: 'UART', gpio: 'GP4/GP5', color: '#a855f7', sensorExamples: 'CO2 센서, 지문 센서' },
];

// 포트 위치 배치 (SVG 좌표)
// 보드 상단에 아날로그 + 디지털, 하단에 I2C + UART
const PORT_POSITIONS: Record<string, { x: number; y: number }> = {
  // 상단 행 - 왼쪽부터: 아날로그 3개, 디지털 3개
  A0:    { x: 60,  y: 55 },
  A1:    { x: 150, y: 55 },
  A2:    { x: 240, y: 55 },
  D16:   { x: 360, y: 55 },
  D18:   { x: 450, y: 55 },
  D20:   { x: 540, y: 55 },
  // 하단 행 - I2C 2개, UART 2개
  I2C0:  { x: 105, y: 195 },
  I2C1:  { x: 225, y: 195 },
  UART0: { x: 390, y: 195 },
  UART1: { x: 510, y: 195 },
};

// === 키프레임 애니메이션을 위한 스타일 태그 ===

const KEYFRAMES = `
@keyframes grove-pulse {
  0% { r: 28; opacity: 0.6; }
  50% { r: 36; opacity: 0.2; }
  100% { r: 28; opacity: 0.6; }
}
@keyframes grove-ripple {
  0% { r: 20; opacity: 0.5; }
  100% { r: 50; opacity: 0; }
}
`;

// === 개별 포트 커넥터 컴포넌트 ===

function GroveConnector({
  port,
  position,
  isActive,
  isHovered,
  connectedSensor,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  port: PortInfo;
  position: { x: number; y: number };
  isActive: boolean;
  isHovered: boolean;
  connectedSensor?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  const { x, y } = position;

  return (
    <g
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`${port.name} 포트 (${port.type}, ${port.gpio})`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* 활성 포트 glow + ripple */}
      {isActive && (
        <>
          <circle
            cx={x}
            cy={y}
            r={28}
            fill={port.color}
            opacity={0.3}
            style={{ animation: 'grove-pulse 1.5s ease-in-out infinite' }}
          />
          <circle
            cx={x}
            cy={y}
            r={20}
            fill="none"
            stroke={port.color}
            strokeWidth={2}
            opacity={0}
            style={{ animation: 'grove-ripple 2s ease-out infinite' }}
          />
        </>
      )}

      {/* 커넥터 배경 (둥근 사각형) */}
      <rect
        x={x - 22}
        y={y - 16}
        width={44}
        height={32}
        rx={4}
        ry={4}
        fill={isActive || isHovered ? port.color : '#1e293b'}
        stroke={port.color}
        strokeWidth={isActive ? 2.5 : isHovered ? 2 : 1.5}
        style={{
          transition: 'fill 0.2s, stroke-width 0.2s',
          filter: isActive ? `drop-shadow(0 0 6px ${port.color})` : 'none',
        }}
      />

      {/* 4핀 표시 (Grove 커넥터의 4개 핀) */}
      {[-9, -3, 3, 9].map((offset, i) => (
        <circle
          key={i}
          cx={x + offset}
          cy={y}
          r={2.5}
          fill={isActive || isHovered ? '#fff' : port.color}
          style={{ transition: 'fill 0.2s' }}
        />
      ))}

      {/* 포트 이름 라벨 */}
      <text
        x={x}
        y={y - 23}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fontFamily="system-ui, sans-serif"
        fill={isActive ? port.color : '#94a3b8'}
        style={{ transition: 'fill 0.2s' }}
      >
        {port.name}
      </text>

      {/* GPIO 번호 */}
      <text
        x={x}
        y={y + 28}
        textAnchor="middle"
        fontSize={9}
        fontFamily="system-ui, sans-serif"
        fill="#64748b"
      >
        {port.gpio}
      </text>

      {/* 연결된 센서 표시 */}
      {connectedSensor && (
        <g>
          <rect
            x={x - 30}
            y={y + 34}
            width={60}
            height={16}
            rx={3}
            fill={port.color}
            opacity={0.15}
          />
          <text
            x={x}
            y={y + 45}
            textAnchor="middle"
            fontSize={8}
            fontFamily="system-ui, sans-serif"
            fill={port.color}
            fontWeight={500}
          >
            {connectedSensor.length > 8
              ? connectedSensor.slice(0, 7) + '...'
              : connectedSensor}
          </text>
        </g>
      )}
    </g>
  );
}

// === 툴팁 컴포넌트 ===

function Tooltip({
  port,
  position,
  connectedSensor,
}: {
  port: PortInfo;
  position: { x: number; y: number };
  connectedSensor?: string;
}) {
  const tooltipWidth = 180;
  const tooltipHeight = connectedSensor ? 100 : 82;
  // 툴팁이 SVG 밖으로 나가지 않도록 위치 조정
  let tx = position.x - tooltipWidth / 2;
  if (tx < 5) tx = 5;
  if (tx + tooltipWidth > 595) tx = 595 - tooltipWidth;
  const ty = position.y > 140 ? position.y - tooltipHeight - 30 : position.y + 55;

  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* 배경 */}
      <rect
        x={tx}
        y={ty}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={8}
        fill="#0f172a"
        stroke={port.color}
        strokeWidth={1}
        opacity={0.95}
        filter="url(#tooltipShadow)"
      />
      {/* 포트 이름 */}
      <text x={tx + 12} y={ty + 20} fontSize={13} fontWeight={700} fill={port.color} fontFamily="system-ui, sans-serif">
        {port.name}
      </text>
      {/* 타입 배지 */}
      <rect x={tx + tooltipWidth - 60} y={ty + 8} width={48} height={18} rx={4} fill={port.color} opacity={0.2} />
      <text x={tx + tooltipWidth - 36} y={ty + 21} fontSize={9} fontWeight={600} fill={port.color} textAnchor="middle" fontFamily="system-ui, sans-serif">
        {port.type}
      </text>
      {/* GPIO */}
      <text x={tx + 12} y={ty + 38} fontSize={10} fill="#94a3b8" fontFamily="system-ui, sans-serif">
        GPIO: <tspan fill="#e2e8f0" fontWeight={500}>{port.gpio}</tspan>
      </text>
      {/* 센서 예시 */}
      <text x={tx + 12} y={ty + 55} fontSize={10} fill="#94a3b8" fontFamily="system-ui, sans-serif">
        사용 가능: <tspan fill="#cbd5e1">{port.sensorExamples}</tspan>
      </text>
      {/* 연결된 센서 */}
      {connectedSensor && (
        <text x={tx + 12} y={ty + 72} fontSize={10} fill="#94a3b8" fontFamily="system-ui, sans-serif">
          연결됨: <tspan fill={port.color} fontWeight={600}>{connectedSensor}</tspan>
        </text>
      )}
    </g>
  );
}

// === 메인 컴포넌트 ===

export default function GroveShieldMap({
  activePort,
  connectedSensors = [],
  onPortClick,
  className = '',
}: GroveShieldMapProps) {
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);

  const sensorMap = new Map(connectedSensors.map((s) => [s.port, s.sensorName]));

  const hoveredInfo = PORTS.find((p) => p.name === hoveredPort);
  const hoveredPos = hoveredPort ? PORT_POSITIONS[hoveredPort] : null;

  return (
    <div className={className} style={{ width: '100%', maxWidth: 640 }}>
      <style>{KEYFRAMES}</style>
      <svg
        viewBox="0 0 600 280"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="Grove Shield for Pi Pico v1.0 포트 맵"
      >
        <defs>
          <filter id="tooltipShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <filter id="boardShadow" x="-2%" y="-2%" width="104%" height="108%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 보드 배경 */}
        <rect
          x={10}
          y={10}
          width={580}
          height={240}
          rx={12}
          fill="#1a2332"
          stroke="#334155"
          strokeWidth={2}
          filter="url(#boardShadow)"
        />

        {/* 보드 모서리 마운팅 홀 */}
        {[
          [26, 26],
          [574, 26],
          [26, 234],
          [574, 234],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill="none" stroke="#475569" strokeWidth={1.5} />
        ))}

        {/* 보드 제목 */}
        <text x={300} y={140} textAnchor="middle" fontSize={12} fill="#475569" fontFamily="system-ui, sans-serif" fontWeight={600}>
          Grove Shield for Pi Pico v1.0
        </text>

        {/* 영역 구분선 */}
        <line x1={310} y1={30} x2={310} y2={100} stroke="#2d3a4a" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={310} y1={170} x2={310} y2={230} stroke="#2d3a4a" strokeWidth={1} strokeDasharray="4 3" />

        {/* 영역 라벨 */}
        <text x={150} y={100} textAnchor="middle" fontSize={8} fill="#22c55e" opacity={0.5} fontFamily="system-ui, sans-serif">ANALOG</text>
        <text x={450} y={100} textAnchor="middle" fontSize={8} fill="#3b82f6" opacity={0.5} fontFamily="system-ui, sans-serif">DIGITAL</text>
        <text x={165} y={232} textAnchor="middle" fontSize={8} fill="#eab308" opacity={0.5} fontFamily="system-ui, sans-serif">I2C</text>
        <text x={450} y={232} textAnchor="middle" fontSize={8} fill="#a855f7" opacity={0.5} fontFamily="system-ui, sans-serif">UART</text>

        {/* 포트 커넥터들 */}
        {PORTS.map((port) => (
          <GroveConnector
            key={port.name}
            port={port}
            position={PORT_POSITIONS[port.name]}
            isActive={activePort === port.name}
            isHovered={hoveredPort === port.name}
            connectedSensor={sensorMap.get(port.name)}
            onMouseEnter={() => setHoveredPort(port.name)}
            onMouseLeave={() => setHoveredPort(null)}
            onClick={() => onPortClick?.(port)}
          />
        ))}

        {/* 툴팁 (호버 시) */}
        {hoveredInfo && hoveredPos && (
          <Tooltip
            port={hoveredInfo}
            position={hoveredPos}
            connectedSensor={sensorMap.get(hoveredInfo.name)}
          />
        )}
      </svg>

      {/* 범례 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginTop: 8,
          flexWrap: 'wrap',
          fontSize: 12,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {(
          [
            { label: '아날로그', color: '#22c55e' },
            { label: '디지털', color: '#3b82f6' },
            { label: 'I2C', color: '#eab308' },
            { label: 'UART', color: '#a855f7' },
          ] as const
        ).map(({ label, color }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: color,
                display: 'inline-block',
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
