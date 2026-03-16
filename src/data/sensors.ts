// 32종 Grove 센서 상세 데이터
// 카테고리: 환경, 소리/진동, 빛/색상, 거리/움직임, 신체, 입력, 출력

export type Category = '환경' | '소리/진동' | '빛/색상' | '거리/움직임' | '신체' | '입력' | '출력';
export type PortType = '아날로그' | '디지털' | 'I2C' | 'UART' | 'PWM';

export interface Sensor {
  id: string;
  name: string;
  model: string;
  category: Category;
  portType: PortType;
  difficulty: 1 | 2 | 3;
  description: string;
  measureRange?: string;
  usedInLessons?: string[];
  projectIdeas: string[];
  pinInfo: string;
  codeSnippet: string;
}

export const categories: Category[] = ['환경', '소리/진동', '빛/색상', '거리/움직임', '신체', '입력', '출력'];
export const portTypes: PortType[] = ['아날로그', '디지털', 'I2C', 'UART', 'PWM'];

export const sensors: Sensor[] = [
  // ── 환경 (8종) ──────────────────────────────────────────
  {
    id: 'dht20',
    name: '온습도 센서',
    model: 'DHT20',
    category: '환경',
    portType: 'I2C',
    difficulty: 1,
    description: '온도와 습도를 동시에 측정하는 기본 환경 센서',
    measureRange: '-40~80°C, 0~100%RH',
    usedInLessons: ['1차시', '3차시', '4차시'],
    projectIdeas: [
      '교실 온습도 24시간 모니터링 시스템',
      '옷장 습도 알림기 만들기',
      '식물 생장 환경 자동 기록기',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from dht20 import DHT20

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = DHT20(i2c)
temp = sensor.temperature
humi = sensor.humidity
print(f"온도: {temp}°C, 습도: {humi}%")`,
  },
  {
    id: 'scd30',
    name: 'CO2 센서',
    model: 'SCD30',
    category: '환경',
    portType: 'I2C',
    difficulty: 2,
    description: '이산화탄소 농도를 정밀 측정하는 NDIR 방식 환경 센서',
    measureRange: '400~10000ppm',
    usedInLessons: ['5차시'],
    projectIdeas: [
      '환기 타이밍 알려주는 CO2 신호등',
      '교실별 공기질 비교 실험',
      '식물의 광합성과 CO2 변화 관찰',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from scd30 import SCD30

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = SCD30(i2c)
sensor.start_continous_measurement()
co2 = sensor.co2
print(f"CO2: {co2} ppm")`,
  },
  {
    id: 'aht20-bmp280',
    name: '온습도+기압 센서',
    model: 'AHT20+BMP280',
    category: '환경',
    portType: 'I2C',
    difficulty: 1,
    description: '온습도(AHT20)와 대기압/고도(BMP280)를 동시에 측정하는 콤보 모듈',
    measureRange: '300~1100hPa, -40~85°C',
    projectIdeas: [
      '층별 기압 차이로 고도 계산하기',
      '날씨 변화 예측 장치 만들기',
      '엘리베이터 층수 추적기',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from bmp280 import BMP280

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = BMP280(i2c)
pressure = sensor.pressure
temp = sensor.temperature
print(f"기압: {pressure}hPa, 온도: {temp}°C")`,
  },
  {
    id: 'hm3301',
    name: '미세먼지 센서',
    model: 'HM3301',
    category: '환경',
    portType: 'I2C',
    difficulty: 2,
    description: 'PM2.5와 PM10 미세먼지 농도를 측정하는 센서',
    measureRange: 'PM2.5/PM10 0~1000μg/m³',
    projectIdeas: [
      '우리 학교 미세먼지 지도 만들기',
      '요리할 때 주방 미세먼지 변화 관찰',
      '실내외 공기질 비교 프로젝트',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from hm3301 import HM3301

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = HM3301(i2c)
data = sensor.read()
pm25 = data['PM2.5']
pm10 = data['PM10']
print(f"PM2.5: {pm25}, PM10: {pm10} μg/m³")`,
  },
  {
    id: 'guva-s12d',
    name: '자외선 센서',
    model: 'GUVA-S12D',
    category: '환경',
    portType: '아날로그',
    difficulty: 1,
    description: '자외선(UV) 지수를 측정하는 센서',
    measureRange: 'UV Index 0~11',
    projectIdeas: [
      '자외선 지수별 선크림 알림기',
      '그늘과 양지 UV 비교 실험',
      '시간대별 자외선 변화 기록기',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin
import time

uv_sensor = ADC(Pin(26))
raw = uv_sensor.read_u16()
voltage = raw / 65535 * 3.3
uv_index = voltage / 0.1
print(f"UV 지수: {uv_index:.1f}")`,
  },
  {
    id: 'moisture',
    name: '토양수분 센서',
    model: 'Moisture Sensor',
    category: '환경',
    portType: '아날로그',
    difficulty: 1,
    description: '흙의 수분량을 측정하는 센서',
    projectIdeas: [
      '화분 물주기 알림 시스템',
      '다양한 흙의 수분 보유력 비교',
      '자동 급수 장치 만들기',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin
import time

soil = ADC(Pin(26))
raw = soil.read_u16()
moisture = raw / 65535 * 100
print(f"토양 수분: {moisture:.1f}%")`,
  },
  {
    id: 'tds',
    name: '수질 센서',
    model: 'TDS Sensor',
    category: '환경',
    portType: '아날로그',
    difficulty: 2,
    description: '수질(총용존고형물)을 측정하는 센서',
    measureRange: '0~1000ppm',
    projectIdeas: [
      '수돗물 vs 정수기물 수질 비교',
      '강물 수질 모니터링 프로젝트',
      '식물에 좋은 물 찾기 실험',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin

tds_sensor = ADC(Pin(26))
raw = tds_sensor.read_u16()
voltage = raw / 65535 * 3.3
tds = (133.42 * voltage**3 - 255.86 * voltage**2
       + 857.39 * voltage) * 0.5
print(f"수질 TDS: {tds:.0f} ppm")`,
  },
  {
    id: 'multichannel-gas',
    name: '복합 가스 센서',
    model: 'Multichannel Gas v2',
    category: '환경',
    portType: 'I2C',
    difficulty: 3,
    description: 'NO2, CO, VOC 등 여러 가스를 동시에 측정하는 센서',
    projectIdeas: [
      '교실 환기 전후 공기질 변화 측정',
      '주방에서 발생하는 가스 종류 분석',
      '도로변 vs 공원 공기질 비교 연구',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from multichannel_gas import MultichannelGas

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
gas = MultichannelGas(i2c)
no2 = gas.measure_NO2()
co = gas.measure_CO()
voc = gas.measure_VOC()
print(f"NO2: {no2}, CO: {co}, VOC: {voc}")`,
  },

  // ── 소리/진동 (3종) ────────────────────────────────────
  {
    id: 'sound',
    name: '소리 센서',
    model: 'Analog Microphone (MEMS)',
    category: '소리/진동',
    portType: '아날로그',
    difficulty: 1,
    description: 'MEMS 마이크로 주변 소음 레벨을 측정하는 센서',
    usedInLessons: ['6차시'],
    projectIdeas: [
      '도서관 소음 레벨 모니터링',
      '소리 크기에 반응하는 LED 바',
      '우리 반 소음 패턴 분석 프로젝트',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin
import time

mic = ADC(Pin(26))
raw = mic.read_u16()
level = raw / 65535 * 100
print(f"소음 레벨: {level:.1f}%")`,
  },
  {
    id: 'vibration',
    name: '진동 센서',
    model: 'Vibration Sensor',
    category: '소리/진동',
    portType: '디지털',
    difficulty: 1,
    description: '진동을 감지하는 센서 (있음/없음)',
    projectIdeas: [
      '지진 감지 알람 시스템',
      '세탁기 완료 알림기',
      '문 열림 감지 보안 장치',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin
import time

vib = Pin(16, Pin.IN)
while True:
    if vib.value():
        print("진동 감지!")
    time.sleep(0.1)`,
  },
  {
    id: 'vibration-motor',
    name: '진동 모터',
    model: 'Vibration Motor',
    category: '소리/진동',
    portType: '디지털',
    difficulty: 1,
    description: '진동을 출력하는 모터 (햅틱 피드백)',
    projectIdeas: [
      '알림 시계 (소리 없이 진동으로 알림)',
      '거리 센서와 연동한 진동 안내기',
      '게임 컨트롤러 피드백 장치',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin
import time

motor = Pin(16, Pin.OUT)
motor.value(1)   # 진동 시작
time.sleep(0.5)
motor.value(0)   # 진동 중지
print("진동 완료")`,
  },

  // ── 빛/색상 (4종) ──────────────────────────────────────
  {
    id: 'light',
    name: '빛 센서',
    model: 'Light Sensor v1.2',
    category: '빛/색상',
    portType: '아날로그',
    difficulty: 1,
    description: '주변 밝기를 측정하는 기본 광센서',
    usedInLessons: ['2차시', '4차시'],
    projectIdeas: [
      '자동 밝기 조절 조명 만들기',
      '하루 중 밝기 변화 기록기',
      '장소별 조도 비교 실험',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin

light = ADC(Pin(26))
raw = light.read_u16()
brightness = raw / 65535 * 100
print(f"밝기: {brightness:.1f}%")`,
  },
  {
    id: 'tsl2591',
    name: '디지털 빛 센서',
    model: 'TSL2591',
    category: '빛/색상',
    portType: 'I2C',
    difficulty: 2,
    description: '정밀 조도(럭스)를 측정하는 디지털 광센서',
    measureRange: '0.000188~88000 lux',
    projectIdeas: [
      '교실 조명 환경 평가 프로젝트',
      '식물 광합성에 필요한 조도 실험',
      '독서에 적합한 조도 조건 찾기',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from tsl2591 import TSL2591

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = TSL2591(i2c)
lux = sensor.lux
print(f"조도: {lux:.1f} lux")`,
  },
  {
    id: 'tcs34725',
    name: '색상 센서',
    model: 'TCS34725',
    category: '빛/색상',
    portType: 'I2C',
    difficulty: 2,
    description: 'RGB 색상을 인식하는 컬러 센서',
    projectIdeas: [
      '색상 분류 컨베이어 벨트 시뮬레이션',
      '과일 익음 정도 판별기',
      '색깔 맞추기 게임 만들기',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from tcs34725 import TCS34725

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = TCS34725(i2c)
r, g, b, c = sensor.read()
print(f"R:{r} G:{g} B:{b} 밝기:{c}")`,
  },
  {
    id: 'ir-receiver',
    name: '적외선 수신 센서',
    model: 'IR Receiver',
    category: '빛/색상',
    portType: '디지털',
    difficulty: 1,
    description: '리모컨 적외선 신호를 수신하는 센서',
    projectIdeas: [
      '리모컨으로 LED 제어하기',
      'IR 리모컨 신호 해독 실험',
      '나만의 리모컨 명령 체계 만들기',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin
from ir_receiver import IRReceiver

ir = IRReceiver(Pin(16))
while True:
    code = ir.read()
    if code:
        print(f"수신 코드: {hex(code)}")`,
  },

  // ── 거리/움직임 (6종) ──────────────────────────────────
  {
    id: 'ultrasonic',
    name: '초음파 거리 센서',
    model: 'Ultrasonic Ranger v2',
    category: '거리/움직임',
    portType: '디지털',
    difficulty: 1,
    description: '초음파로 거리를 측정하는 센서 (2~400cm)',
    measureRange: '2~400cm',
    usedInLessons: ['8차시'],
    projectIdeas: [
      '스마트 휴지통 (손 감지로 뚜껑 열기)',
      '주차 보조 시스템 만들기',
      '사회적 거리두기 알림 장치',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin
from ultrasonic import Ultrasonic

sensor = Ultrasonic(Pin(16))
distance = sensor.distance_cm()
print(f"거리: {distance:.1f} cm")`,
  },
  {
    id: 'vl53l0x',
    name: 'ToF 거리 센서',
    model: 'VL53L0X',
    category: '거리/움직임',
    portType: 'I2C',
    difficulty: 2,
    description: '레이저로 정밀 거리를 측정하는 센서 (~2m)',
    measureRange: '30~2000mm',
    projectIdeas: [
      '정밀 키 측정기 만들기',
      '물체 높이 자동 측정 장치',
      '로봇 장애물 회피 시스템',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from vl53l0x import VL53L0X

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = VL53L0X(i2c)
distance = sensor.read()
print(f"거리: {distance} mm")`,
  },
  {
    id: 'pir',
    name: 'PIR 동작 센서',
    model: 'PIR Motion Sensor',
    category: '거리/움직임',
    portType: '디지털',
    difficulty: 1,
    description: '사람의 움직임을 감지하는 적외선 센서',
    projectIdeas: [
      '자동 조명 시스템 (사람 감지시 점등)',
      '교실 출입 카운터',
      '방범 알람 시스템 만들기',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin
import time

pir = Pin(16, Pin.IN)
while True:
    if pir.value():
        print("움직임 감지!")
    time.sleep(0.5)`,
  },
  {
    id: 'adxl345',
    name: '3축 가속도 센서',
    model: 'ADXL345',
    category: '거리/움직임',
    portType: 'I2C',
    difficulty: 2,
    description: '3축 가속도와 기울기를 측정하는 센서',
    measureRange: '±2g ~ ±16g',
    projectIdeas: [
      '만보기(걸음 수 세기) 만들기',
      '기울기 감지 미로 게임',
      '교량 진동 모니터링 시뮬레이션',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from adxl345 import ADXL345

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = ADXL345(i2c)
x, y, z = sensor.read()
print(f"X:{x:.2f} Y:{y:.2f} Z:{z:.2f} g")`,
  },
  {
    id: 'mpu6050',
    name: '자이로+가속도 센서',
    model: 'MPU6050',
    category: '거리/움직임',
    portType: 'I2C',
    difficulty: 3,
    description: '6축 모션 센싱 (가속도 3축 + 자이로 3축)',
    measureRange: '가속도 ±2~16g, 자이로 ±250~2000°/s',
    projectIdeas: [
      '드론 자세 제어 시뮬레이터',
      '모션 인식 제스처 컨트롤러',
      '흔들림 감지 안정화 플랫폼',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from mpu6050 import MPU6050

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
imu = MPU6050(i2c)
ax, ay, az = imu.accel
gx, gy, gz = imu.gyro
print(f"가속: {ax:.1f},{ay:.1f},{az:.1f}")
print(f"자이로: {gx:.1f},{gy:.1f},{gz:.1f}")`,
  },
  {
    id: 'gps-neo6m',
    name: 'GPS 센서',
    model: 'NEO-6M',
    category: '거리/움직임',
    portType: 'UART',
    difficulty: 3,
    description: 'GPS 위성으로 위치와 속도를 측정하는 센서',
    projectIdeas: [
      '등하교 경로 추적 지도 만들기',
      '이동 속도 측정기',
      '보물찾기 좌표 게임',
    ],
    pinInfo: 'UART (GP0=TX, GP1=RX)',
    codeSnippet: `from machine import UART, Pin
import time

gps = UART(0, baudrate=9600, tx=Pin(0), rx=Pin(1))
while True:
    data = gps.readline()
    if data and b'GPGGA' in data:
        print(data.decode().strip())
    time.sleep(1)`,
  },

  // ── 신체 (3종) ─────────────────────────────────────────
  {
    id: 'pulse',
    name: '심박 센서',
    model: 'Pulse Sensor',
    category: '신체',
    portType: '아날로그',
    difficulty: 2,
    description: '손가락 끝에서 심박수를 측정하는 센서',
    usedInLessons: ['7차시'],
    projectIdeas: [
      '운동 전후 심박수 비교 실험',
      '긴장 상태 감지 스트레스 미터',
      '심박 리듬 시각화 프로젝트',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin
import time

pulse = ADC(Pin(26))
while True:
    raw = pulse.read_u16()
    bpm = raw / 65535 * 200  # 간이 변환
    print(f"심박 신호: {raw}, 추정 BPM: {bpm:.0f}")
    time.sleep(0.02)`,
  },
  {
    id: 'gsr',
    name: 'GSR 피부전도 센서',
    model: 'GSR Sensor',
    category: '신체',
    portType: '아날로그',
    difficulty: 2,
    description: '피부 전기 전도도를 측정하는 센서 (스트레스 지표)',
    projectIdeas: [
      '거짓말 탐지기 (간이 폴리그래프)',
      '시험 전후 스트레스 레벨 비교',
      '명상 효과 데이터로 검증하기',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin
import time

gsr = ADC(Pin(26))
raw = gsr.read_u16()
conductance = raw / 65535 * 100
print(f"피부 전도도: {conductance:.1f}%")`,
  },
  {
    id: 'mlx90614',
    name: '비접촉 체온 센서',
    model: 'MLX90614',
    category: '신체',
    portType: 'I2C',
    difficulty: 2,
    description: '비접촉으로 물체/체온을 측정하는 적외선 온도 센서',
    measureRange: '-70~380°C (물체), -40~125°C (주변)',
    projectIdeas: [
      '비접촉 체온 측정 게이트',
      '음식 온도 안전 체크기',
      '열화상 간이 스캐너 만들기',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from mlx90614 import MLX90614

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
sensor = MLX90614(i2c)
obj_temp = sensor.object_temp
amb_temp = sensor.ambient_temp
print(f"물체: {obj_temp:.1f}°C, 주변: {amb_temp:.1f}°C")`,
  },

  // ── 입력 (4종) ─────────────────────────────────────────
  {
    id: 'button',
    name: '버튼',
    model: 'Button',
    category: '입력',
    portType: '디지털',
    difficulty: 1,
    description: '누름을 감지하는 기본 입력 장치',
    projectIdeas: [
      '반응 속도 테스트 게임',
      '퀴즈 버저 시스템',
      '버튼 조합 비밀번호 잠금장치',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin

button = Pin(16, Pin.IN, Pin.PULL_UP)
if button.value() == 0:
    print("버튼 눌림!")
else:
    print("버튼 안 눌림")`,
  },
  {
    id: 'rotary-angle',
    name: '로터리 앵글 센서',
    model: 'Rotary Angle Sensor',
    category: '입력',
    portType: '아날로그',
    difficulty: 1,
    description: '회전 각도를 입력하는 가변저항 센서',
    projectIdeas: [
      '볼륨 조절기 (부저 음량 제어)',
      'LED 밝기 다이얼',
      '서보 모터 각도 조종기',
    ],
    pinInfo: 'GP26 (A0)',
    codeSnippet: `from machine import ADC, Pin

knob = ADC(Pin(26))
raw = knob.read_u16()
angle = raw / 65535 * 300  # 0~300도
print(f"각도: {angle:.1f}°")`,
  },
  {
    id: 'ps2-joystick',
    name: 'PS2 조이스틱',
    model: 'PS2 조이스틱',
    category: '입력',
    portType: '아날로그',
    difficulty: 1,
    description: 'X/Y 2축 아날로그 + 버튼 입력 장치',
    projectIdeas: [
      'OLED 화면 위의 미니 게임 조작기',
      '서보 2개로 만든 팬틸트 제어기',
      '그림 그리기 입력 장치',
    ],
    pinInfo: 'GP26 (VRx), GP27 (VRy), GP16 (SW 버튼)',
    codeSnippet: `from machine import ADC, Pin

vrx = ADC(Pin(26))  # X축 아날로그
vry = ADC(Pin(27))  # Y축 아날로그
sw = Pin(16, Pin.IN, Pin.PULL_UP)  # 버튼
x = vrx.read_u16()
y = vry.read_u16()
btn = sw.value()  # 0이면 눌림
print(f"X: {x}, Y: {y}, 버튼: {btn}")`,
  },
  {
    id: 'touch',
    name: '터치 센서',
    model: 'Touch Sensor',
    category: '입력',
    portType: '디지털',
    difficulty: 1,
    description: '손가락 터치를 감지하는 정전식 센서',
    projectIdeas: [
      '터치 피아노 건반 만들기',
      '터치 ON/OFF 스위치',
      '터치 카운터 (방문자 수 세기)',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin

touch = Pin(16, Pin.IN)
if touch.value():
    print("터치 감지!")
else:
    print("터치 없음")`,
  },

  // ── 출력 (4종) ─────────────────────────────────────────
  {
    id: 'led-bar',
    name: 'LED 바',
    model: 'LED Bar v2',
    category: '출력',
    portType: '디지털',
    difficulty: 1,
    description: '10단계 LED로 값을 시각적으로 표시하는 장치',
    projectIdeas: [
      '소음 레벨 표시기',
      '타이머 카운트다운 바',
      '센서 값 실시간 모니터',
    ],
    pinInfo: 'GP16 (DI), GP17 (DCKI)',
    codeSnippet: `from machine import Pin
from led_bar import LEDBar

bar = LEDBar(Pin(16), Pin(17))
bar.set_level(7)  # 10칸 중 7칸 점등
print("LED 바: 7/10 표시")`,
  },
  {
    id: 'oled-ssd1306',
    name: 'OLED 디스플레이',
    model: 'SSD1306',
    category: '출력',
    portType: 'I2C',
    difficulty: 2,
    description: '128x64 픽셀 OLED에 텍스트와 그래픽을 표시',
    projectIdeas: [
      '센서 데이터 실시간 대시보드',
      '미니 디지털 시계',
      '가위바위보 게임 화면',
    ],
    pinInfo: 'I2C (GP6=SDA, GP7=SCL)',
    codeSnippet: `from machine import I2C, Pin
from ssd1306 import SSD1306_I2C

i2c = I2C(1, sda=Pin(6), scl=Pin(7))
oled = SSD1306_I2C(128, 64, i2c)
oled.fill(0)
oled.text("Hello!", 0, 0)
oled.text("온도: 25.3C", 0, 16)
oled.show()`,
  },
  {
    id: 'buzzer',
    name: '부저',
    model: 'Buzzer',
    category: '출력',
    portType: '디지털',
    difficulty: 1,
    description: '소리를 출력하는 피에조 부저',
    projectIdeas: [
      '간단한 멜로디 연주기',
      '거리 센서 연동 경보기',
      '모스 부호 송신기',
    ],
    pinInfo: 'GP16 (D16)',
    codeSnippet: `from machine import Pin, PWM
import time

buzzer = PWM(Pin(16))
buzzer.freq(1000)   # 1000Hz 음
buzzer.duty_u16(32768)
time.sleep(0.5)
buzzer.duty_u16(0)  # 소리 끄기`,
  },
  {
    id: 'servo',
    name: '서보 모터',
    model: 'Servo Motor',
    category: '출력',
    portType: 'PWM',
    difficulty: 1,
    description: '정확한 각도로 회전하는 모터 (0~180도)',
    measureRange: '0~180°',
    projectIdeas: [
      '자동 쓰레기통 뚜껑 열기',
      '로봇 팔 관절 제어',
      '풍향계 바늘 구동기',
    ],
    pinInfo: 'GP16 (PWM)',
    codeSnippet: `from machine import Pin, PWM
import time

servo = PWM(Pin(16))
servo.freq(50)
# 각도 → 듀티: 0°=1ms, 90°=1.5ms, 180°=2ms
def set_angle(angle):
    duty = int(1638 + angle / 180 * 6553)
    servo.duty_u16(duty)

set_angle(90)  # 90도로 회전`,
  },
];
