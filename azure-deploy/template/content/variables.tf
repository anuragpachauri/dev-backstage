variable "resource_group_name" {
  type = string
}

variable "location" {
  type    = string
  default = "East US"
}

variable "virtual_network_name" {
  type = string
}

variable "network_interface_name" {
  type = string
}

variable "vm_name" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "admin_password" {
  type = string
  sensitive = true
}

variable "storage_account_name" {
  type = string
}

variable "public_ip_name" {
  type = string
}

variable "tagkey" {
  type = string
} 

variable "tagvalue"{
  type = string
} 