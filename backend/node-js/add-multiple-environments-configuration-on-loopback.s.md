# [Standard] Add multiple environments configuration on loopback

## Owner: Maxime Sraïki

# Why

Whenever you are developing a loopback application, you'll need to have multiple environments in order to control the impact of your development team on the other environments: dev, staging, prod...

## Checks

* You need to have a root configuration file with all the trans environment datas
* Each environment specific configuration file has to be named with the same standard
* Each environment specific configuration file has to have only the informations of its own environment

## Examples

## Bad Examples

### Example 1: Wrong configuration files naming, they don't respect the same pattern

![Wrong configuration files naming](/assets/bad-configuration-naming-example.png)

### Example 2: Multiple environments variables in one config file

```json
{
  "key1": "value1",
  "key2": "value2",
  "key3": {
    "staging": "value3-staging",
    "prod": "value3-prod",
  }
}
```

## Good Examples

### Example 1: Good configuration files naming

![Good configuration files naming](/assets/good-configuration-naming-example.png)

### Example 2: Only own environments variables in one config file

```json
{
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```
