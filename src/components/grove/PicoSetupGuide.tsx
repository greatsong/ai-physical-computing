import { useState } from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
  instruction: string;
}

const STEPS: Step[] = [
  {
    id: 'orient',
    title: '1. 방향 확인',
    description: 'Pico 2 WH의 Micro USB 포트가 위쪽을 향하도록 놓으세요.',
    instruction: 'Micro USB 포트와 BOOTSEL 버튼의 위치를 확인합니다.',
  },
  {
    id: 'shield',
    title: '2. Shield 장착',
    description: 'Grove Shield의 USB 아이콘과 Pico의 USB 포트 방향을 맞춰 꽂습니다.',
    instruction: '핀 40개가 모두 들어갈 때까지 끝까지 눌러 꽂습니다. 한쪽만 들어가면 동작하지 않습니다.',
  },
  {
    id: 'usb',
    title: '3. USB 연결',
    description: 'Micro USB 케이블로 컴퓨터와 Pico를 연결합니다.',
    instruction: '데이터 전송이 되는 케이블을 사용하세요. 충전 전용 케이블은 Pico를 인식하지 못합니다.',
  },
  {
    id: 'bootsel',
    title: '4. BOOTSEL 모드 (첫 사용 시)',
    description: 'BOOTSEL 버튼을 누른 채로 USB를 연결하면 펌웨어 설치 모드로 진입합니다.',
    instruction: '처음 한 번만 필요합니다. 이후에는 그냥 연결하면 됩니다.',
  },
];

export default function PicoSetupGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleComplete = (idx: number) => {
    const next = new Set(completedSteps);
    next.add(idx);
    setCompletedSteps(next);
    if (idx < STEPS.length - 1) {
      setActiveStep(idx + 1);
    }
  };

  const allDone = completedSteps.size === STEPS.length;

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 640,
        border: '1px solid #c7d2fe',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fefefe',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          padding: '14px 18px',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700 }}>전원 연결 & 보드 세팅 가이드</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
          각 단계를 클릭하고 완료 버튼을 눌러 진행하세요
        </div>
      </div>

      {/* SVG 일러스트 */}
      <div style={{ padding: '16px 18px 0' }}>
        <svg viewBox="0 0 560 200" style={{ width: '100%', maxWidth: 560 }}>
          {/* Pico 2 WH 보드 */}
          <rect
            x={180} y={30} width={200} height={90} rx={6}
            fill={activeStep === 0 ? '#e0e7ff' : '#f1f5f9'}
            stroke={activeStep === 0 ? '#6366f1' : '#94a3b8'}
            strokeWidth={activeStep === 0 ? 2 : 1}
          />
          <text x={280} y={55} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">
            Raspberry Pi Pico 2 WH
          </text>
          {/* RP2350 칩 */}
          <rect x={250} y={65} width={60} height={40} rx={3} fill="#475569" />
          <text x={280} y={90} textAnchor="middle" fontSize={9} fill="#e2e8f0" fontWeight={600}>
            RP2350
          </text>

          {/* Micro USB 포트 */}
          <rect
            x={265} y={17} width={30} height={16} rx={4}
            fill={activeStep === 2 ? '#22c55e' : '#94a3b8'}
            stroke={activeStep === 2 ? '#16a34a' : '#64748b'}
            strokeWidth={activeStep === 2 ? 2 : 1}
          />
          <text x={280} y={28} textAnchor="middle" fontSize={6} fill="#fff" fontWeight={600}>
            Micro USB
          </text>

          {/* BOOTSEL 버튼 */}
          <circle
            cx={220} cy={85} r={8}
            fill={activeStep === 3 ? '#f59e0b' : '#d1d5db'}
            stroke={activeStep === 3 ? '#d97706' : '#9ca3af'}
            strokeWidth={activeStep === 3 ? 2 : 1}
          />
          <text x={220} y={101} textAnchor="middle" fontSize={6} fill="#64748b" fontWeight={500}>
            BOOTSEL
          </text>

          {/* 핀 헤더 (양쪽) */}
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={`pin-l-${i}`}>
              <rect x={183} y={33 + i * 4.2} width={4} height={3} rx={0.5} fill="#eab308" />
              <rect x={373} y={33 + i * 4.2} width={4} height={3} rx={0.5} fill="#eab308" />
            </g>
          ))}

          {/* Grove Shield (투명 오버레이) */}
          <rect
            x={160} y={20} width={240} height={115} rx={8}
            fill="none"
            stroke={activeStep === 1 ? '#6366f1' : '#cbd5e1'}
            strokeWidth={activeStep === 1 ? 2.5 : 1}
            strokeDasharray={activeStep === 1 ? '6 3' : 'none'}
          />
          {activeStep === 1 && (
            <text x={280} y={148} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>
              Grove Shield 장착 위치
            </text>
          )}

          {/* USB 케이블 + 컴퓨터 */}
          {activeStep >= 2 && (
            <>
              {/* 케이블 */}
              <line x1={280} y1={17} x2={280} y2={-5} stroke="#22c55e" strokeWidth={2} />
              <path d="M 280 -5 Q 280 -20 200 -20 Q 80 -20 80 30" stroke="#22c55e" strokeWidth={2} fill="none" strokeDasharray="4 2" />
              {/* 컴퓨터 */}
              <rect x={40} y={30} width={80} height={55} rx={4} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
              <text x={80} y={55} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={600}>
                컴퓨터
              </text>
              <text x={80} y={70} textAnchor="middle" fontSize={7} fill="#94a3b8">
                (Thonny IDE)
              </text>
            </>
          )}

          {/* Grove 포트 표시 (Shield 장착 후) */}
          {completedSteps.has(1) && (
            <>
              {[
                { x: 170, y: 140, label: 'A0', color: '#22c55e' },
                { x: 210, y: 140, label: 'A1', color: '#22c55e' },
                { x: 250, y: 140, label: 'D16', color: '#3b82f6' },
                { x: 290, y: 140, label: 'D18', color: '#3b82f6' },
                { x: 330, y: 140, label: 'I2C0', color: '#eab308' },
                { x: 375, y: 140, label: 'I2C1', color: '#eab308' },
              ].map(({ x, y, label, color }) => (
                <g key={label}>
                  <rect x={x - 15} y={y} width={30} height={14} rx={3} fill={color} opacity={0.2} stroke={color} strokeWidth={0.8} />
                  <text x={x} y={y + 10} textAnchor="middle" fontSize={7} fill={color} fontWeight={600}>
                    {label}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* BOOTSEL 누른 상태 표시 */}
          {activeStep === 3 && (
            <>
              <circle cx={220} cy={85} r={10} fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x={220} y={115} textAnchor="middle" fontSize={8} fill="#d97706" fontWeight={600}>
                누른 채로 USB 연결!
              </text>
            </>
          )}

          {/* 전원 표시 */}
          {completedSteps.has(2) && (
            <g>
              <circle cx={350} cy={45} r={5} fill="#22c55e">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={360} y={48} fontSize={7} fill="#22c55e" fontWeight={500}>
                전원 ON
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 단계 목록 */}
      <div style={{ padding: '8px 18px 14px' }}>
        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          const isDone = completedSteps.has(idx);
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '10px 12px',
                margin: '4px 0',
                borderRadius: 8,
                border: isActive ? '2px solid #6366f1' : '1px solid #e2e8f0',
                backgroundColor: isDone ? '#f0fdf4' : isActive ? '#eef2ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* 상태 아이콘 */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    backgroundColor: isDone ? '#22c55e' : isActive ? '#6366f1' : '#e2e8f0',
                    color: isDone || isActive ? '#fff' : '#94a3b8',
                  }}
                >
                  {isDone ? '\u2713' : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                    {step.description}
                  </div>
                </div>
              </div>

              {/* 상세 안내 (활성 단계만) */}
              {isActive && !isDone && (
                <div style={{ marginTop: 8, marginLeft: 32 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#475569',
                      padding: '6px 10px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 6,
                      borderLeft: '3px solid #6366f1',
                    }}
                  >
                    {step.instruction}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(idx);
                    }}
                    style={{
                      marginTop: 8,
                      padding: '5px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#fff',
                      backgroundColor: '#6366f1',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    완료
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* 완료 메시지 */}
        {allDone && (
          <div
            style={{
              marginTop: 8,
              padding: '10px 14px',
              borderRadius: 8,
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: 13,
              color: '#166534',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            모든 준비가 완료되었습니다! Thonny에서 코딩을 시작하세요.
          </div>
        )}
      </div>
    </div>
  );
}
