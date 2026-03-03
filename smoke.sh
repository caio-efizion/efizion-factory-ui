#!/bin/bash
# Smoke test script for efizion-factory-ui
# Tests homepage and critical UI endpoints

set -e

# Configuration
UI_URL="${UI_URL:-http://localhost:3000}"

echo "🔍 Running smoke tests for UI at: $UI_URL"
echo ""

# Test 1: Homepage
echo "Test 1: GET / (homepage)"
response=$(curl -s -o /dev/null -w "%{http_code}" "$UI_URL/")
if [ "$response" = "200" ]; then
  echo "✅ Homepage check passed (HTTP $response)"
else
  echo "❌ Homepage check failed (HTTP $response)"
  exit 1
fi

# Test 2: Check if page contains expected content
echo ""
echo "Test 2: Homepage content validation"
content=$(curl -s "$UI_URL/")
if echo "$content" | grep -q "Efizion\|efizion\|Dashboard\|Tasks"; then
  echo "✅ Homepage content validation passed"
else
  echo "❌ Homepage content validation failed (expected keywords not found)"
  exit 1
fi

# Test 3: Dashboard page (if exists)
echo ""
echo "Test 3: GET /dashboard (if available)"
response=$(curl -s -o /dev/null -w "%{http_code}" "$UI_URL/dashboard")
if [ "$response" = "200" ] || [ "$response" = "404" ]; then
  echo "✅ Dashboard endpoint reachable (HTTP $response)"
else
  echo "⚠️  Dashboard endpoint returned HTTP $response (non-critical)"
fi

# Test 4: Tasks page (if exists)
echo ""
echo "Test 4: GET /tasks (if available)"
response=$(curl -s -o /dev/null -w "%{http_code}" "$UI_URL/tasks")
if [ "$response" = "200" ] || [ "$response" = "404" ]; then
  echo "✅ Tasks endpoint reachable (HTTP $response)"
else
  echo "⚠️  Tasks endpoint returned HTTP $response (non-critical)"
fi

echo ""
echo "✅ All critical smoke tests passed!"
