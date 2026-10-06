import unittest

from agent.twin import AgentTwin
from agent.risk import RiskAnalyzer


class RiskAnalyzerTest(unittest.TestCase):

    def test_risk_and_blast_radius(self):
        twin = AgentTwin({"balance": 100, "status": "active"})

        twin_result = twin.simulate(
            "run_115",
            [
                {
                    "action_type": "data_write",
                    "action": "update_balance",
                    "input": {"balance": 150},
                },
                {
                    "action_type": "state_change",
                    "action": "set_status",
                    "input": {"status": "review"},
                },
                {
                    "action_type": "tool_call",
                    "action": "send_payment",
                    "input": {"amount": 50},
                },
            ],
        )

        assessment = RiskAnalyzer().analyze(twin_result)

        self.assertEqual(assessment.run_id, "run_115")
        self.assertEqual(assessment.risk_score, 90)
        self.assertEqual(assessment.risk_level, "critical")
        self.assertEqual(assessment.blast_radius, 2)
        self.assertEqual(len(assessment.factors), 3)


if __name__ == "__main__":
    unittest.main()
