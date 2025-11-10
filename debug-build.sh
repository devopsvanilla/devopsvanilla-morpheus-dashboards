#!/bin/bash
# Script para rebuild rápido durante desenvolvimento

echo "🔨 Building plugin..."
./gradlew morpheus-home-dashboard-plugin:shadowJar

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Plugin JAR location:"
    echo "   morpheus-home-dashboard-plugin/build/libs/morpheus-home-dashboard-plugin-*-all.jar"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Upload to Morpheus: Administration → Integrations → Plugins"
    echo "   2. Click 'Upload File' and select the JAR"
    echo "   3. Reload the dashboard page (Ctrl+Shift+R for hard reload)"
    echo ""
    echo "🐛 Debug tips:"
    echo "   - Check Morpheus logs for Groovy errors"
    echo "   - Open Browser DevTools (F12) for JavaScript errors"
    echo "   - Use Network tab to monitor API calls"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi
