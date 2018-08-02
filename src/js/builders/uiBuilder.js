var uiBuilder = (function () {

    function _buildFormGroup(name) {
        var formgroup = $('<div class="form-group p-2"></div>');
        formgroup.append('<label>' + name + '</label>')
        return formgroup;
    }

    return {
        buildFormGroup: _buildFormGroup,
    }
}());