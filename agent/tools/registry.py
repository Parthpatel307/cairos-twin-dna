from typing import Any, Callable, Dict


ToolHandler = Callable[[Dict[str, Any]], Any]


class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, ToolHandler] = {}

    def register(self, name: str, handler: ToolHandler) -> None:
        if not name or not name.strip():
            raise ValueError("tool name cannot be empty")

        if not callable(handler):
            raise TypeError("tool handler must be callable")

        self._tools[name.strip()] = handler

    def has(self, name: str) -> bool:
        return name in self._tools

    def list_tools(self):
        return sorted(self._tools.keys())

    def execute(self, name: str, inputs: Dict[str, Any]) -> Any:
        if name not in self._tools:
            raise KeyError(f"Tool not registered: {name}")

        return self._tools[name](inputs)