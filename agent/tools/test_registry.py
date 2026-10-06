import unittest

from agent.tools.registry import ToolRegistry


class TestToolRegistry(unittest.TestCase):

    def test_register_and_execute(self):
        registry = ToolRegistry()

        registry.register(
            "customer_lookup",
            lambda inputs: {
                "customer_id": inputs["customer_id"],
                "status": "found",
            },
        )

        self.assertTrue(registry.has("customer_lookup"))
        self.assertEqual(
            registry.list_tools(),
            ["customer_lookup"],
        )

        result = registry.execute(
            "customer_lookup",
            {"customer_id": "C001"},
        )

        self.assertEqual(
            result,
            {
                "customer_id": "C001",
                "status": "found",
            },
        )

    def test_missing_tool_raises(self):
        registry = ToolRegistry()

        with self.assertRaises(KeyError):
            registry.execute(
                "missing_tool",
                {},
            )


if __name__ == "__main__":
    unittest.main()