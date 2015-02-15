var context = require.context('./modules', true, /-test\.jsx$/);
context.keys().forEach(context);
