resource_group_name     = "${{ values.environment }}-rg"
location                = "East US"
virtual_network_name    = "${{ values.virtual_network_name }}"
network_interface_name  = "${{ values.network_interface_name }}"
vm_name                 = "${{ values.vm_name }}"
admin_username          = "${{ values.admin_username }}"
admin_password          = "${{ values.admin_password }}"
storage_account_name    = "${{ values.storage_account_name }}"
tagkey                  = "${{ values.tagkey }}"
tagvalue                = "${{ values.tagvalue }}"
public_ip_name          = "${{ values.public_ip_name }}"
