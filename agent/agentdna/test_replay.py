import unittest

from agent.agentdna.event import ExecutionEvent
from agent.agentdna.replay import CausalReplayer


class TestCausalReplay(unittest.TestCase):

    def test_counterfactual_avoids_failure(self):
        events = [
            ExecutionEvent(
                event_id="evt_001",
                run_id="run_080",
                sequence=1,
                event_type="decision",
                actor="agent",
                action="update_customer_record",
            ),
            ExecutionEvent(
                event_id="evt_002",
                run_id="run_080",
                sequence=2,
                event_type="tool_call",
                actor="agent",
                action="update_customer_record",
                tool="customer_update",
            ),
            ExecutionEvent(
                event_id="evt_003",
                run_id="run_080",
                sequence=3,
                event_type="error",
                actor="system",
                error={
                    "message": "simulated database failure"
                },
            ),
        ]

        result = CausalReplayer().replay(
            events=events,
            candidate_event_id="evt_001",
            alternative_action="validate_customer_record_before_update",
        )

        self.assertEqual(
            result.original_outcome,
            "failure",
        )
        self.assertEqual(
            result.counterfactual_outcome,
            "success",
        )
        self.assertTrue(result.failure_avoided)
        self.assertEqual(
            result.alternative_action,
            "validate_customer_record_before_update",
        )
        self.assertEqual(
            result.candidate_event_id,
            "evt_001",
        )


if __name__ == "__main__":
    unittest.main()