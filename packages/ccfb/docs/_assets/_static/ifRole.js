window.document.getElementById("p2").style.color = "blue";
RoleUtil = {
  _ROLES_CONSTANT: "ifRoles",
  addRole: function(role) {
    const roles = this.getRoles()?this.getRoles():[]
    if(!roles.includes(role)){
      roles.push(role)
    }
    localStorage.setItem(this._ROLES_CONSTANT, roles.join(" "))
  },
  removeRole:  function(role) {
    roles = this.getRoles();
    var index = roles.indexOf(role);
    if (index !== -1) {
      roles.splice(index, 1);
      localStorage.setItem(this._ROLES_CONSTANT, roles.join(" "))
    }
  },
  clearRoles:  function() {
    localStorage.removeItem(this._ROLES_CONSTANT)
  },
  getRoles: function() {
    const roleInputs = localStorage.getItem(this._ROLES_CONSTANT);
    const roles = roleInputs?roleInputs.split(" "):undefined
    return roles
  },
  iffer: function(value) {
    return `[if${value.toUpperCase().charAt(0) + value.substring(1)}]`;
  },
  setCss: function() {
    const roleInputs = localStorage.getItem(this._ROLES_CONSTANT);
    const roles = roleInputs?roleInputs.split(" "):undefined
    for(role in roles){
      const uprole = this.iffer(roles[role]);
      console.log(`ADDING ${uprole}`)
      try{
        const selected = window.document.querySelectorAll(uprole);
        selected.forEach(function(item) {
          item.style.display='block'
        });
        // window.document.querySelectorAll(uprole).style.display='block';
      } catch (error) {
        console.error(`IGNORING ${error}`);
      }
    }
  }
}
RoleUtil.clearRoles()
RoleUtil.addRole("loo")
RoleUtil.addRole("boo")
RoleUtil.addRole("bee")
RoleUtil.addRole("buu")
RoleUtil.removeRole("bah")
RoleUtil.removeRole("loo")
RoleUtil.setCss()