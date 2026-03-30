import { useState, useCallback, useEffect } from 'react';

// === 타입 정의 ===

interface SensorItem {
  id: string;
  name: string;
  correctPort: string;
  portType: '아날로그' | '디지털' | 'I2C' | 'UART';
  hint: string;
}

interface PortSlot {
  name: string;
  type: '아날로그' | '디지털' | 'I2C' | 'UART';
  color: string;
  x: number;
  y: number;
}

interface VirtualWiringProps {
  /** 연결할 센서 목록 (차시별로 다르게 전달) */
  sensors: SensorItem[];
  /** 제목 */
  title?: string;
}

// === 포트 슬롯 정의 ===

const PORTS: PortSlot[] = [
  { name: 'A0', type: '아날로그', color: '#22c55e', x: 80, y: 80 },
  { name: 'A1', type: '아날로그', color: '#22c55e', x: 180, y: 80 },
  { name: 'A2', type: '아날로그', color: '#22c55e', x: 280, y: 80 },
  { name: 'D16', type: '디지털', color: '#3b82f6', x: 380, y: 80 },
  { name: 'D18', type: '디지털', color: '#3b82f6', x: 460, y: 80 },
  { name: 'D20', type: '디지털', color: '#3b82f6', x: 540, y: 80 },
  { name: 'I2C0', type: 'I2C', color: '#eab308', x: 130, y: 180 },
  { name: 'I2C1', type: 'I2C', color: '#eab308', x: 270, y: 180 },
  { name: 'UART0', type: 'UART', color: '#a855f7', x: 410, y: 180 },
];

// === 메인 컴포넌트 ===

export default function VirtualWiring({ sensors, title = '센서 연결 시뮬레이터' }: VirtualWiringProps) {
  // 테마 감지
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // 각 포트에 연결된 센서 ID
  const [connections, setConnections] = useState<Record<string, string>>({});
  // 현재 드래그 중인 센서
  const [dragging, setDragging] = useState<string | null>(null);
  // 호버 중인 포트
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  // 결과 표시 여부
  const [showResult, setShowResult] = useState(false);
  // 힌트 표시 센서
  const [hintSensor, setHintSensor] = useState<string | null>(null);

  // 센서→포트 연결 맵 (역방향)
  const sensorToPort = Object.entries(connections).reduce<Record<string, string>>(
    (acc, [port, sensorId]) => {
      acc[sensorId] = port;
      return acc;
    },
    {}
  );

  const handleDragStart = useCallback((sensorId: string) => {
    setDragging(sensorId);
    setShowResult(false);
  }, []);

  const handleDrop = useCallback(
    (portName: string) => {
      if (!dragging) return;
      // 기존에 이 센서가 다른 포트에 연결돼 있으면 제거
      const newConnections = { ...connections };
      for (const [port, sid] of Object.entries(newConnections)) {
        if (sid === dragging) delete newConnections[port];
      }
      // 이 포트에 기존 센서가 있으면 제거
      delete newConnections[portName];
      // 새 연결
      newConnections[portName] = dragging;
      setConnections(newConnections);
      setDragging(null);
      setHoveredPort(null);
    },
    [dragging, connections]
  );

  const handleRemove = useCallback(
    (portName: string) => {
      const newConnections = { ...connections };
      delete newConnections[portName];
      setConnections(newConnections);
      setShowResult(false);
    },
    [connections]
  );

  const checkAnswers = useCallback(() => {
    setShowResult(true);
  }, []);

  const resetAll = useCallback(() => {
    setConnections({});
    setShowResult(false);
    setHintSensor(null);
  }, []);

  // 정답 체크
  const getResult = (sensorId: string) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    if (!sensor) return null;
    const connectedPort = sensorToPort[sensorId];
    if (!connectedPort) return 'missing';
    return connectedPort === sensor.correctPort ? 'correct' : 'wrong';
  };

  const allConnected = sensors.every((s) => sensorToPort[s.id]);
  const allCorrect = showResult && sensors.every((s) => getResult(s.id) === 'correct');

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(78, 205, 196, 0.5)'}`,
        background: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)',
        padding: '1rem',
        fontFamily: 'system-ui, sans-serif',
        color: isDark ? '#e2e8f0' : '#1e293b',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{title}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={checkAnswers}
            disabled={!allConnected}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 6,
              border: 'none',
              background: allConnected ? '#4ECDC4' : isDark ? '#334155' : '#e2e8f0',
              color: allConnected ? '#000' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: allConnected ? 'pointer' : 'default',
            }}
          >
            확인
          </button>
          <button
            onClick={resetAll}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 6,
              border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
              background: 'transparent',
              color: isDark ? '#94a3b8' : '#64748b',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            초기화
          </button>
        </div>
      </div>

      {/* 성공 메시지 */}
      {allCorrect && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ade80',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}
        >
          모든 센서가 올바르게 연결되었습니다!
        </div>
      )}

      {/* 보드 SVG */}
      <svg
        viewBox="0 0 580 230"
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '0.75rem' }}
      >
        {/* 보드 배경 */}
        <rect x={5} y={5} width={570} height={220} rx={10} fill={isDark ? '#1a2332' : '#f1f5f9'} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1.5} />
        <text x={290} y={140} textAnchor="middle" fontSize={10} fill={isDark ? '#334155' : '#94a3b8'} fontWeight={600}>
          Grove Shield for Pi Pico v1.0
        </text>

        {/* 포트 슬롯들 */}
        {PORTS.map((port) => {
          const connectedSensorId = connections[port.name];
          const sensor = connectedSensorId ? sensors.find((s) => s.id === connectedSensorId) : null;
          const isDropTarget = dragging && !connectedSensorId;
          const isHovered = hoveredPort === port.name;
          const result = showResult && sensor ? getResult(sensor.id) : null;

          let borderColor = port.color;
          if (result === 'correct') borderColor = '#22c55e';
          if (result === 'wrong') borderColor = '#ef4444';

          return (
            <g
              key={port.name}
              onMouseEnter={() => { if (dragging) setHoveredPort(port.name); }}
              onMouseLeave={() => setHoveredPort(null)}
              onMouseUp={() => { if (dragging) handleDrop(port.name); }}
              style={{ cursor: isDropTarget ? 'copy' : sensor ? 'pointer' : 'default' }}
              onClick={() => { if (sensor && !dragging) handleRemove(port.name); }}
            >
              {/* 포트 배경 */}
              <rect
                x={port.x - 28}
                y={port.y - 18}
                width={56}
                height={36}
                rx={5}
                fill={
                  sensor
                    ? result === 'wrong'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : result === 'correct'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(78, 205, 196, 0.15)'
                    : isHovered && isDropTarget
                      ? 'rgba(78, 205, 196, 0.15)'
                      : isDark ? '#0f172a' : '#e2e8f0'
                }
                stroke={borderColor}
                strokeWidth={isHovered && isDropTarget ? 2.5 : sensor ? 2 : 1.5}
                strokeDasharray={isDropTarget && !sensor ? '4 3' : 'none'}
              />

              {/* 4핀 */}
              {[-10, -3.5, 3.5, 10].map((offset, i) => (
                <circle key={i} cx={port.x + offset} cy={port.y} r={2.5} fill={sensor ? '#fff' : port.color} opacity={sensor ? 0.8 : 0.5} />
              ))}

              {/* 포트 라벨 */}
              <text x={port.x} y={port.y - 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={port.color}>
                {port.name}
              </text>

              {/* 연결된 센서 이름 */}
              {sensor && (
                <text x={port.x} y={port.y + 30} textAnchor="middle" fontSize={8} fontWeight={500} fill={result === 'wrong' ? '#ef4444' : result === 'correct' ? '#4ade80' : isDark ? '#94a3b8' : '#64748b'}>
                  {sensor.name.length > 10 ? sensor.name.slice(0, 9) + '...' : sensor.name}
                </text>
              )}

              {/* 드롭 가능 표시 */}
              {isDropTarget && !sensor && isHovered && (
                <text x={port.x} y={port.y + 4} textAnchor="middle" fontSize={18} fill="#4ECDC4" opacity={0.7}>
                  +
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 센서 카드 목록 (드래그 소스) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {sensors.map((sensor) => {
          const connected = !!sensorToPort[sensor.id];
          const result = showResult ? getResult(sensor.id) : null;
          const showHint = hintSensor === sensor.id;

          return (
            <div key={sensor.id} style={{ position: 'relative' }}>
              <div
                draggable={!connected}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  handleDragStart(sensor.id);
                }}
                onMouseDown={() => { if (!connected) handleDragStart(sensor.id); }}
                onMouseUp={() => {
                  // 포트 위에서 놓지 않은 경우 드래그 취소
                  if (dragging === sensor.id && !hoveredPort) {
                    setDragging(null);
                  }
                }}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: 8,
                  border: `1.5px solid ${
                    result === 'correct'
                      ? '#22c55e'
                      : result === 'wrong'
                        ? '#ef4444'
                        : connected
                          ? '#4ECDC4'
                          : dragging === sensor.id
                            ? '#4ECDC4'
                            : isDark ? '#475569' : '#cbd5e1'
                  }`,
                  background:
                    result === 'correct'
                      ? 'rgba(34, 197, 94, 0.1)'
                      : result === 'wrong'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : connected
                          ? 'rgba(78, 205, 196, 0.08)'
                          : isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  cursor: connected ? 'default' : 'grab',
                  opacity: connected && dragging ? 0.5 : 1,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                {/* 포트 타입 뱃지 */}
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.3rem',
                    borderRadius: 4,
                    background:
                      sensor.portType === 'I2C'
                        ? 'rgba(234, 179, 8, 0.2)'
                        : sensor.portType === '아날로그'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : sensor.portType === '디지털'
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(168, 85, 247, 0.2)',
                    color:
                      sensor.portType === 'I2C'
                        ? '#eab308'
                        : sensor.portType === '아날로그'
                          ? '#22c55e'
                          : sensor.portType === '디지털'
                            ? '#3b82f6'
                            : '#a855f7',
                  }}
                >
                  {sensor.portType}
                </span>
                <span>{sensor.name}</span>

                {/* 연결됨 표시 */}
                {connected && (
                  <span style={{ fontSize: '0.7rem', color: isDark ? '#64748b' : '#94a3b8' }}>
                    → {sensorToPort[sensor.id]}
                  </span>
                )}

                {/* 결과 아이콘 */}
                {result === 'correct' && <span style={{ color: '#22c55e' }}>&#10003;</span>}
                {result === 'wrong' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHintSensor(showHint ? null : sensor.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: 0,
                    }}
                    title="힌트 보기"
                  >
                    &#10007;
                  </button>
                )}
              </div>

              {/* 힌트 팝업 */}
              {showHint && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    marginBottom: 4,
                    padding: '0.375rem 0.625rem',
                    borderRadius: 6,
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                    fontSize: '0.75rem',
                    color: isDark ? '#cbd5e1' : '#334155',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                  }}
                >
                  {sensor.hint}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0 0 0', }}>
        센서 카드를 클릭한 후 보드의 포트를 클릭하여 연결하세요. 연결된 포트를 클릭하면 해제됩니다.
      </p>
    </div>
  );
}
