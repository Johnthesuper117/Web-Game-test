import asyncio
import websockets
import threading

class PythonInterpreter:
    def __init__(self):
        self.input_queue = asyncio.Queue()
        self.output_queue = asyncio.Queue()

    async def process_input(self):
        while True:
            command = await self.input_queue.get()
            if command.startswith('/'):
                await self.output_queue.put(f"Executing command: {command}")
                # Handle custom `/` commands here
            else:
                try:
                    # Execute Python code
                    result = eval(command)
                    if result is not None:
                        await self.output_queue.put(str(result))
                except Exception as e:
                    await self.output_queue.put(f"Error: {e}")

    async def read_output(self, websocket):
        while True:
            output = await self.output_queue.get()
            await websocket.send(output)

    async def handle_connection(self, websocket, path):
        producer_task = asyncio.create_task(self.read_output(websocket))
        consumer_task = asyncio.create_task(self.receive_input(websocket))
        await asyncio.gather(producer_task, consumer_task)

    async def receive_input(self, websocket):
        async for message in websocket:
            await self.input_queue.put(message)


interpreter = PythonInterpreter()
server = websockets.serve(interpreter.handle_connection, "localhost", 5000)

loop = asyncio.get_event_loop()
loop.run_until_complete(server)

# Start the Python interpreter in a separate thread
interpreter_thread = threading.Thread(target=loop.run_until_complete, args=(interpreter.process_input(),))
interpreter_thread.start()

loop.run_forever()
