/**
 * @author Admin
 */

module.exports = function (app, express) {
app.use(express.static(__dirname + '/../public'));
app.use(express.bodyParser());

app.configure('development', function () {
app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

app.configure('production',function () {
app.use(express.errorHandler());
});
        
}

