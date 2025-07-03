# Lux Parser SEO Tool - Configuration Files

This directory contains comprehensive configuration files for all modules in the Lux Parser SEO Tool. Each configuration file is designed to provide maximum flexibility and control over the tool's behavior.

## Configuration Files Overview

### 1. Master Configuration
- **`master-config.json`** - Main configuration file that defines all modules, their relationships, workflows, and global settings.

### 2. Module-Specific Configurations

#### Scraper Parser Module
- **`scraper-config.json`** - Configuration for extracting data from search engines using dorks
  - Search engine settings (Google, Bing, Yahoo, etc.)
  - Dork generation parameters
  - Filtering and output options
  - Performance and proxy settings

#### Parser Module
- **`parser-config.json`** - Configuration for parsing data with custom rules and proxies
  - **Database Range: Standard** (as requested)
  - **Search Aggressiveness: 9** (as requested)
  - Parsing rules and patterns
  - Data processing options
  - Performance optimization settings

#### Vulnerability Scanner Module
- **`vulnerability-scanner-config.json`** - Configuration for scanning websites for vulnerabilities
  - Multiple vulnerability types (SQLi, XSS, RCE, LFI, SSRF, XXE)
  - Target configuration and scanning behavior
  - Authentication and proxy settings
  - Reporting and compliance options

#### Dorks Checker Module
- **`dorks-checker-config.json`** - Configuration for validating and checking dork effectiveness
  - Dork validation rules
  - Effectiveness testing across search engines
  - Scoring system and analysis options
  - Performance and output settings

#### Dumper Module
- **`dumper-config.json`** - Configuration for extracting data from databases and websites
  - Multiple dumping methods (SQLi, WordPress, cPanel)
  - Target configuration and validation
  - Data extraction options
  - Performance and safety settings

#### Dehasher Module
- **`dehasher-config.json`** - Configuration for decrypting various hash types
  - Support for multiple hash types (MD5, SHA1, SHA256, bcrypt, WordPress)
  - Cracking methods (rainbow tables, dictionary, brute force)
  - Performance optimization
  - Output and monitoring settings

#### Antipublic Checker Module
- **`antipublic-checker-config.json`** - Configuration for checking combolists against public databases
  - Combolist processing options
  - Database source configuration
  - Result categorization
  - Performance and safety settings

## Key Configuration Highlights

### Parser Module Specific Settings (as requested)
```json
{
  "database_range": {
    "type": "Standard",
    "include_public": true,
    "include_private": false,
    "include_premium": false
  },
  "search_aggressiveness": {
    "level": 9,
    "max_concurrent_threads": 50,
    "request_rate_limit": 1000,
    "timeout_per_request": 5
  }
}
```

## Configuration Structure

Each configuration file follows a consistent structure:

1. **Module Information** - Name, description, version
2. **Settings** - Core configuration options
3. **Files** - Input/output file specifications
4. **Monitoring** - Logging and metrics configuration
5. **Advanced Settings** - Debug and optimization options

## Usage Instructions

### 1. Basic Setup
1. Copy the configuration files to your project directory
2. Modify the settings according to your needs
3. Ensure all referenced files (proxies, dictionaries, etc.) are in place
4. Update API keys if using external services

### 2. Module-Specific Configuration
Each module can be configured independently:
- Enable/disable specific features
- Adjust performance parameters
- Configure input/output files
- Set up proxy and authentication settings

### 3. Workflow Configuration
The master configuration includes predefined workflows:
- **Standard Workflow**: Scraper → Parser → Antipublic Checker
- **Vulnerability Workflow**: Vulnerability Scanner → Dumper → Dehasher
- **Hash Analysis Workflow**: Dehasher → Parser

### 4. Performance Tuning
Key performance settings to adjust:
- `max_concurrent_threads` - Number of parallel operations
- `memory_limit` - Maximum memory usage
- `cpu_usage_limit` - CPU utilization limit
- `request_timeout` - Network request timeout
- `batch_size` - Processing batch size

## File Dependencies

### Required Input Files
- `keywords.txt` - Keywords for dork generation
- `proxies.txt` - Proxy list for requests
- `targets.txt` - Target URLs/IPs for scanning
- `hashes.txt` - Hash list for cracking
- `combolist.txt` - Combolist for antipublic checking

### Optional Input Files
- `dictionaries/` - Dictionary files for hash cracking
- `rainbow_tables/` - Rainbow table files
- `payloads/` - Custom payload files for vulnerability scanning

### Output Directories
- `./output` - Main output directory
- `./logs` - Log files
- `./cache` - Cache files
- `./backups` - Backup files

## Security Considerations

1. **API Keys**: Store API keys securely and never commit them to version control
2. **Proxies**: Use reliable proxy services to avoid IP blocking
3. **Rate Limiting**: Respect API rate limits to avoid service disruption
4. **Safe Mode**: Enable safe mode for non-destructive operations
5. **Audit Logging**: Enable audit logging for compliance and debugging

## Performance Optimization

### High-Performance Setup
```json
{
  "performance": {
    "max_concurrent_threads": 100,
    "memory_limit": "16GB",
    "cpu_usage_limit": 95,
    "disk_cache_enabled": true,
    "cache_size": "10GB"
  }
}
```

### Conservative Setup
```json
{
  "performance": {
    "max_concurrent_threads": 10,
    "memory_limit": "2GB",
    "cpu_usage_limit": 50,
    "disk_cache_enabled": false
  }
}
```

## Troubleshooting

### Common Issues
1. **Memory Errors**: Reduce `memory_limit` and `batch_size`
2. **Timeout Errors**: Increase `request_timeout` and `max_retries`
3. **Rate Limiting**: Reduce `max_concurrent_threads` and add delays
4. **Proxy Issues**: Check proxy file format and authentication

### Debug Mode
Enable debug mode in any module for detailed logging:
```json
{
  "advanced": {
    "debug_mode": true,
    "verbose_output": true
  }
}
```

## Support

For configuration issues or questions:
1. Check the module-specific documentation
2. Review the example configurations
3. Enable debug mode for detailed error information
4. Check log files for specific error messages

## Version History

- **v1.0.0** - Initial configuration files with all modules
- Includes specific settings for Parser module (database_range: Standard, search_aggressiveness: 9)
- Comprehensive workflow definitions
- Complete API integration support 