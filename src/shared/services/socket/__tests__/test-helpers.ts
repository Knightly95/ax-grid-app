import { SOCKET_EVENTS } from '../socketEvents';
import { socketService } from '../socketService';
import { vi, type Mock } from 'vitest';

type MockFn = Mock;

export interface MockSocket {
  emit: MockFn;
  on: MockFn;
  disconnect?: MockFn;
  connected: boolean;
  removeAllListeners?: MockFn;
}

export function testEmitWithPayload({
  method,
  event,
  payload,
  arg,
  mockSocket,
}: {
  method: (arg: string) => void;
  event: keyof typeof SOCKET_EVENTS;
  payload: object;
  arg: string;
  mockSocket: MockSocket;
}) {
  (socketService as unknown as { socket: MockSocket }).socket = { ...mockSocket, connected: true };
  vi.spyOn(socketService, 'isConnected').mockReturnValue(true);
  method(arg);
  expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS[event], payload);
}

export function testNoEmitWhenDisconnected({
  method,
  arg,
  warning,
  mockSocket,
}: {
  method: (arg: string) => void;
  arg: string;
  warning: string;
  mockSocket: MockSocket;
}) {
  (socketService as unknown as { socket: MockSocket }).socket = { ...mockSocket, connected: false };
  vi.spyOn(socketService, 'isConnected').mockReturnValue(false);
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  method(arg);
  expect(mockSocket.emit).not.toHaveBeenCalled();
  expect(warnSpy).toHaveBeenCalledWith(warning);
  warnSpy.mockRestore();
}

export function testEmitNoPayload({
  method,
  event,
  mockSocket,
}: {
  method: () => void;
  event: keyof typeof SOCKET_EVENTS;
  mockSocket: MockSocket;
}) {
  (socketService as unknown as { socket: MockSocket }).socket = { ...mockSocket, connected: true };
  vi.spyOn(socketService, 'isConnected').mockReturnValue(true);
  method();
  expect(mockSocket.emit).toHaveBeenCalledWith(SOCKET_EVENTS[event]);
}

export function testNoEmitNoPayloadWhenDisconnected({
  method,
  warning,
  mockSocket,
}: {
  method: () => void;
  warning: string;
  mockSocket: MockSocket;
}) {
  (socketService as unknown as { socket: MockSocket }).socket = { ...mockSocket, connected: false };
  vi.spyOn(socketService, 'isConnected').mockReturnValue(false);
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  method();
  expect(mockSocket.emit).not.toHaveBeenCalled();
  expect(warnSpy).toHaveBeenCalledWith(warning);
  warnSpy.mockRestore();
}

export function testOnRegistersCallback({
  method,
  event,
  mockSocket,
}: {
  method: (cb: (...args: unknown[]) => void) => void;
  event: keyof typeof SOCKET_EVENTS;
  mockSocket: MockSocket;
}) {
  (socketService as unknown as { socket: MockSocket }).socket = mockSocket;
  const cb = vi.fn();
  method(cb);
  expect(mockSocket.on).toHaveBeenCalledWith(SOCKET_EVENTS[event], cb);
}
