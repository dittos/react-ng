function createNgClass(directiveName, attrNames) {
    var template = '<' + directiveName;
    attrNames.forEach(function(attrName) {
        template += ' ng-attr-' + attrName + '="{{props[\'' + attrName + '\']}}"';
    });
    template += '>{{props.children}}</' + directiveName + '>';
    return React.createClass({
        componentDidMount: function() {
            var node = this.getDOMNode();
            var $injector = angular.element(node).injector();
            var $compile = $injector.get('$compile');
            this._scope = angular.element(node).scope().$new(true);
            this._scope.$watch(function() {
                this._scope.props = this.props;
            }.bind(this));
            this._link = $compile(template);
            angular.element(node).append(this._link(this._scope));
        },
        componentWillUnmount: function() {
            this._scope.$destroy();
        },
        render: function() {
            return React.createElement('div');
        }
    });
}

var MD = {
    Button: createNgClass('md-button', ['noink', 'disabled', 'aria-label'])
};

angular.module('app', ['ngMaterial'])
    .controller('test', function() {
        React.render(
            React.createElement(MD.Button, {}, 'Button'),
            document.getElementById('mount')
        );
    });
