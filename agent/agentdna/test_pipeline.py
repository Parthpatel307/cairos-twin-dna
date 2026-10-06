import unittest

from agent.agentdna.recorder import ExecutionRecorder
from agent.agentdna.trace import AgentTrace
from agent.agentdna.service import AgentDNAService
from agent.agentdna.result import AgentDNAResult


class TestAgentDNAPipeline(unittest.TestCase):

    def test_successful_execution(self) -> None:
        recorder = ExecutionRecorder()

        trace = AgentTrace(
            run_id="test_success",
            recorder=recorder,
        )

        trace.record_user_request(
            "Inspect customer records"
        )

        trace.record_decision(
            "read_customer_records",
            "Read customer records",
        )

        trace.record_tool_call(
            "read_customer_records",
            {
                "table": "customers"
            },
        )

        trace.record_tool_response(
            "read_customer_records",
            {
                "status": "success"
            },
        )

        trace.record_result(
            {
                "status": "success"
            }
        )

        result = AgentDNAService().analyze(
            events=recorder.get_events()
        )

        self.assertIsInstance(
            result,
            AgentDNAResult,
        )

        self.assertEqual(
            result.status,
            "success",
        )

        self.assertEqual(
            result.run_id,
            "test_success",
        )

    def test_causal_failure_analysis(self) -> None:
        recorder = ExecutionRecorder()

        trace = AgentTrace(
            run_id="test_failure",
            recorder=recorder,
        )

        trace.record_user_request(
            "Modify customer database"
        )

        trace.record_decision(
            "update_customer_record",
            "Customer record selected",
        )

        trace.record_error(
            {
                "type": "database_error",
                "message": "Constraint violation",
            }
        )

        replay_executor = (
            lambda action, candidate, events:
            "success"
            if action == (
                "validate_customer_record_before_update"
            )
            else "failure"
        )

        result = AgentDNAService().analyze(
            events=recorder.get_events(),
            alternative_action=(
                "validate_customer_record_before_update"
            ),
            replay_executor=replay_executor,
        )

        self.assertIsInstance(
            result,
            AgentDNAResult,
        )

        self.assertEqual(
            result.run_id,
            "test_failure",
        )

        self.assertIsNotNone(
            result.root_cause,
        )

        self.assertIsNotNone(
            result.replay,
        )

        self.assertEqual(
            result.replay["counterfactual_outcome"],
            "success",
        )

        self.assertTrue(
            result.causal_verification["verified"]
        )


if __name__ == "__main__":
    unittest.main()