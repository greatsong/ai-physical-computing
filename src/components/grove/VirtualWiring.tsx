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
  sensors: SensorItem[];
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

  const [connections, setConnections] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  // 정답 보기 모드 (틀린 센서의 정답을 표시)
  const [revealAnswers, setRevealAnswers] = useState(false);

  // 센서→포트 연결 맵 (역방향)
  const sensorToPort = Object.entries(connections).reduce<Record<string, string>>(
    (acc, [port, sensorId]) => {
      acc[sensorId] = port;
      return acc;
    },
    {}
  );

  // 실시간 정답 체크 (확인 버튼 없이)
  const getResult = (sensorId: string): 'correct' | 'wrong' | 'missing' | null => {
    const sensor = sensors.find((s) => s.id === sensorId);
    if (!sensor) return null;
    const connectedPort = sensorToPort[sensorId];
    if (!connectedPort) return 'missing';
    return connectedPort === sensor.correctPort ? 'correct' : 'wrong';
  };

  const allConnected = sensors.every((s) => sensorToPort[s.id]);
  const allCorrect = sensors.every((s) => getResult(s.id) === 'correct');
  const hasWrong = sensors.some((s) => getResult(s.id) === 'wrong');

  const handleDragStart = useCallback((sensorId: string) => {
    setDragging(sensorId);
    setRevealAnswers(false);
  }, []);

  const handleDrop = useCallback(
    (portName: string) => {
      if (!dragging) return;
      const newConnections = { ...connections };
      for (const [port, sid] of Object.entries(newConnections)) {
        if (sid === dragging) delete newConnections[port];
      }
      delete newConnections[portName];
      newConnections[portName] = dragging;
      setConnections(newConnections);
      setDragging(null);
      setHoveredPort(null);
      setRevealAnswers(false);
    },
    [dragging, connections]
  );

  const handleRemove = useCallback(
    (portName: string) => {
      const newConnections = { ...connections };
      delete newConnections[portName];
      setConnections(newConnections);
      setRevealAnswers(false);
    },
    [connections]
  );

  const handleReveal = useCallback(() => {
    setRevealAnswers(true);
  }, []);

  const resetAll = useCallback(() => {
    setConnections({});
    setRevealAnswers(false);
  }, []);

  // 전체 성공 배너 표시 여부
  const showSuccessBanner = allConnected && allCorrect;

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${showSuccessBanner ? 'rgba(34, 197, 94, 0.5)' : isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(78, 205, 196, 0.5)'}`,
        background: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)',
        padding: '1rem',
        fontFamily: 'system-ui, sans-serif',
        color: isDark ? '#e2e8f0' : '#1e293b',
        transition: 'border-color 0.3s',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{title}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* 정답 보기 버튼 — 틀린 게 있을 때만 표시 */}
          {hasWrong && !revealAnswers && (
            <button
              onClick={handleReveal}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: 6,
                border: 'none',
                background: '#f59e0b',
                color: '#000',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              정답 보기
            </button>
          )}
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

      {/* 전체 성공 메시지 */}
      {showSuccessBanner && (
        <div
          style={{
            padding: '0.625rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            textAlign: 'center',
            animation: 'pulse-glow 1.5s ease-in-out',
          }}
        >
          &#127881; 모든 센서가 올바르게 연결되었습니다!
        </div>
      )}

      {/* 정답 공개 메시지 */}
      {revealAnswers && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
            fontSize: '0.8rem',
            marginBottom: '0.75rem',
          }}
        >
          &#128161; 정답이 표시되었습니다. 올바른 포트를 확인한 후 초기화를 눌러 다시 도전해보세요!
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

          // 이 포트에 연결된 센서의 실시간 결과
          const result = sensor ? getResult(sensor.id) : null;

          // 정답 공개 시, 이 포트가 어떤 센서의 정답인지 표시
          const isAnswerPort = revealAnswers && sensors.some((s) => s.correctPort === port.name && getResult(s.id) === 'wrong');
          const answerSensor = isAnswerPort ? sensors.find((s) => s.correctPort === port.name && getResult(s.id) === 'wrong') : null;

          let borderColor = port.color;
          if (result === 'correct') borderColor = '#22c55e';
          if (result === 'wrong') borderColor = '#ef4444';
          if (isAnswerPort) borderColor = '#f59e0b';

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
                  result === 'correct'
                    ? 'rgba(34, 197, 94, 0.2)'
                    : result === 'wrong'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : sensor
                        ? 'rgba(78, 205, 196, 0.15)'
                        : isAnswerPort
                          ? 'rgba(245, 158, 11, 0.15)'
                          : isHovered && isDropTarget
                            ? 'rgba(78, 205, 196, 0.15)'
                            : isDark ? '#0f172a' : '#e2e8f0'
                }
                stroke={borderColor}
                strokeWidth={result === 'correct' ? 2.5 : isHovered && isDropTarget ? 2.5 : isAnswerPort ? 2.5 : sensor ? 2 : 1.5}
                strokeDasharray={isDropTarget && !sensor ? '4 3' : isAnswerPort ? '6 3' : 'none'}
              />

              {/* 정답 체크마크 (맞으면 즉시 표시) */}
              {result === 'correct' && (
                <text x={port.x + 20} y={port.y - 10} fontSize={14} fill="#22c55e" fontWeight={700}>
                  &#10003;
                </text>
              )}

              {/* 틀림 X 표시 */}
              {result === 'wrong' && (
                <text x={port.x + 20} y={port.y - 10} fontSize={14} fill="#ef4444" fontWeight={700}>
                  &#10007;
                </text>
              )}

              {/* 4핀 */}
              {[-10, -3.5, 3.5, 10].map((offset, i) => (
                <circle key={i} cx={port.x + offset} cy={port.y} r={2.5} fill={result === 'correct' ? '#22c55e' : sensor ? '#fff' : port.color} opacity={sensor ? 0.9 : 0.5} />
              ))}

              {/* 포트 라벨 */}
              <text x={port.x} y={port.y - 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={isAnswerPort ? '#f59e0b' : port.color}>
                {port.name}
              </text>

              {/* 연결된 센서 이름 */}
              {sensor && (
                <text x={port.x} y={port.y + 30} textAnchor="middle" fontSize={8} fontWeight={500} fill={result === 'correct' ? '#22c55e' : result === 'wrong' ? '#ef4444' : isDark ? '#94a3b8' : '#64748b'}>
                  {sensor.name.length > 10 ? sensor.name.slice(0, 9) + '...' : sensor.name}
                </text>
              )}

              {/* 정답 공개 시 올바른 센서 이름 표시 */}
              {answerSensor && !sensor && (
                <text x={port.x} y={port.y + 30} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">
                  &#8592; {answerSensor.name.length > 10 ? answerSensor.name.slice(0, 9) + '...' : answerSensor.name}
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

      {/* 센서 카드 목록 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {sensors.map((sensor) => {
          const connected = !!sensorToPort[sensor.id];
          const result = connected ? getResult(sensor.id) : null;

          // 정답 공개 시 이 센서의 정답 포트
          const showAnswerHint = revealAnswers && result === 'wrong';

          return (
            <div key={sensor.id} style={{ position: 'relative' }}>
              <div
                draggable={!connected || result === 'wrong'}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  handleDragStart(sensor.id);
                }}
                onMouseDown={() => { if (!connected || result === 'wrong') handleDragStart(sensor.id); }}
                onMouseUp={() => {
                  if (dragging === sensor.id && !hoveredPort) {
                    setDragging(null);
                  }
                }}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: 8,
                  border: `2px solid ${
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
                      ? 'rgba(34, 197, 94, 0.15)'
                      : result === 'wrong'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : connected
                          ? 'rgba(78, 205, 196, 0.08)'
                          : isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  cursor: connected && result !== 'wrong' ? 'default' : 'grab',
                  opacity: connected && dragging && dragging !== sensor.id ? 0.5 : 1,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s',
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

                {/* 연결 상태 */}
                {connected && (
                  <span style={{ fontSize: '0.7rem', color: result === 'correct' ? '#22c55e' : result === 'wrong' ? '#ef4444' : isDark ? '#64748b' : '#94a3b8' }}>
                    &#8594; {sensorToPort[sensor.id]}
                  </span>
                )}

                {/* 즉시 결과 아이콘 */}
                {result === 'correct' && <span style={{ color: '#22c55e', fontSize: '1rem' }}>&#10003;</span>}
                {result === 'wrong' && <span style={{ color: '#ef4444', fontSize: '0.9rem' }}>&#10007;</span>}
              </div>

              {/* 정답 공개 힌트 */}
              {showAnswerHint && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    padding: '0.375rem 0.625rem',
                    borderRadius: 6,
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: '1px solid #f59e0b',
                    fontSize: '0.75rem',
                    color: '#f59e0b',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    fontWeight: 600,
                  }}
                >
                  &#128161; 정답: {sensor.correctPort} 포트 ({sensor.hint})
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 안내 */}
      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
        {showSuccessBanner
          ? '잘했어요! 초기화를 눌러 다시 연습할 수 있습니다.'
          : hasWrong
            ? '틀린 연결이 있어요. 포트를 클릭해서 해제한 후 다시 연결하거나, 정답 보기를 눌러보세요.'
            : '센서 카드를 클릭한 후 보드의 포트를 클릭하여 연결하세요. 맞으면 바로 초록색으로 표시됩니다!'}
      </p>
    </div>
  );
}
