import assert from 'node:assert/strict';
import test from 'node:test';
import { applyFrame } from './reduce.js';

const base = {
  kind: 'snapshot',
  deviceId: 'lab-01',
  online: true,
  readings: { temperatureC: 21, humidityPct: 45 },
  sequence: 4,
  timestamp: 1000,
};

test('a legacy snapshot with no kind replaces the frame', () => {
  const message = {
    deviceId: 'lab-01',
    online: true,
    readings: { temperatureC: 22, humidityPct: 40 },
    sequence: 0,
    timestamp: 2000,
  };
  const result = applyFrame(base, message);
  assert.equal(result.accepted, true);
  assert.equal(result.frame, message);
});

test('a delta folds one changed field and keeps the other', () => {
  const result = applyFrame(base, {
    kind: 'delta',
    deviceId: 'lab-01',
    sequence: 5,
    timestamp: 2000,
    patch: { temperatureC: 21.4 },
  });
  assert.equal(result.accepted, true);
  assert.deepEqual(result.frame.readings, { temperatureC: 21.4, humidityPct: 45 });
  assert.equal(result.frame.sequence, 5);
  assert.equal(result.frame.deviceId, 'lab-01');
});

test('an empty patch still advances the sequence', () => {
  const result = applyFrame(base, {
    kind: 'delta',
    sequence: 5,
    timestamp: 2000,
    patch: {},
  });
  assert.equal(result.accepted, true);
  assert.equal(result.frame.sequence, 5);
  assert.deepEqual(result.frame.readings, base.readings);
});

test('a delta that skips a sequence is refused', () => {
  const result = applyFrame(base, {
    kind: 'delta',
    sequence: 7,
    timestamp: 2000,
    patch: { temperatureC: 30 },
  });
  assert.equal(result.accepted, false);
  assert.equal(result.frame, base);
});

test('a delta with no previous frame is refused', () => {
  const result = applyFrame(null, {
    kind: 'delta',
    sequence: 1,
    timestamp: 2000,
    patch: { temperatureC: 21 },
  });
  assert.equal(result.accepted, false);
  assert.equal(result.frame, null);
});

test('a snapshot is accepted even when the sequence jumps', () => {
  const message = {
    kind: 'snapshot',
    deviceId: 'lab-01',
    online: true,
    readings: { temperatureC: 19, humidityPct: 50 },
    sequence: 16,
    timestamp: 9000,
  };
  const result = applyFrame(base, message);
  assert.equal(result.accepted, true);
  assert.equal(result.frame, message);
});
