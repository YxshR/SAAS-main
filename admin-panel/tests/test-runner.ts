import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface TestSuite {
  name: string;
  command: string;
  description: string;
}

interface TestResults {
  suite: string;
  passed: number;
  failed: number;
  duration: number;
  details: any;
}

export class AdminQualityAssuranceRunner {
  private testSuites: TestSuite[] = [
    {
      name: 'visual-regression',
      command: 'npx playwright test --config=tests/setup/visual-regression.config.ts',
      description: 'Visual regression tests for admin components and pages'
    },
    {
      name: 'accessibility',
      command: 'npx playwright test tests/accessibility/',
      description: 'Accessibility compliance tests for admin panel'
    },
    {
      name: 'cross-browser',
      command: 'npx playwright test tests/cross-browser/',
      description: 'Cross-browser compatibility tests for admin panel'
    },
    {
      name: 'unit-tests',
      command: 'npm run test',
      description: 'Unit tests for admin components and utilities'
    }
  ];

  private results: TestResults[] = [];

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Admin Panel Quality Assurance Test Suite\n');

    for (const suite of this.testSuites) {
      await this.runTestSuite(suite);
    }

    this.generateReport();
  }

  async runTestSuite(suite: TestSuite): Promise<void> {
    console.log(`📋 Running ${suite.name}: ${suite.description}`);
    
    const startTime = Date.now();
    
    try {
      const output = execSync(suite.command, { 
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      
      const result: TestResults = {
        suite: suite.name,
        passed: this.parsePassedTests(output),
        failed: this.parseFailedTests(output),
        duration,
        details: output
      };
      
      this.results.push(result);
      
      console.log(`✅ ${suite.name} completed: ${result.passed} passed, ${result.failed} failed (${duration}ms)\n`);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      const result: TestResults = {
        suite: suite.name,
        passed: 0,
        failed: 1,
        duration,
        details: error.message
      };
      
      this.results.push(result);
      
      console.log(`❌ ${suite.name} failed: ${error.message}\n`);
    }
  }

  private parsePassedTests(output: string): number {
    const passedMatch = output.match(/(\d+) passed/);
    return passedMatch ? parseInt(passedMatch[1]) : 0;
  }

  private parseFailedTests(output: string): number {
    const failedMatch = output.match(/(\d+) failed/);
    return failedMatch ? parseInt(failedMatch[1]) : 0;
  }

  private generateReport(): void {
    const totalPassed = this.results.reduce((sum, result) => sum + result.passed, 0);
    const totalFailed = this.results.reduce((sum, result) => sum + result.failed, 0);
    const totalDuration = this.results.reduce((sum, result) => sum + result.duration, 0);

    const report = {
      timestamp: new Date().toISOString(),
      application: 'admin-panel',
      summary: {
        totalTests: totalPassed + totalFailed,
        passed: totalPassed,
        failed: totalFailed,
        duration: totalDuration,
        successRate: totalPassed / (totalPassed + totalFailed) * 100
      },
      suites: this.results,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(process.cwd(), 'test-results', 'admin-qa-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📊 Admin Panel Quality Assurance Report Summary');
    console.log('===============================================');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(2)}%`);
    console.log(`Total Duration: ${report.summary.duration}ms`);
    console.log(`Report saved to: ${reportPath}\n`);

    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedSuites = this.results.filter(result => result.failed > 0);
    
    if (failedSuites.length > 0) {
      recommendations.push('Address failing tests before deployment');
    }

    const accessibilityResult = this.results.find(result => result.suite === 'accessibility');
    if (accessibilityResult && accessibilityResult.failed > 0) {
      recommendations.push('Fix admin panel accessibility issues for better usability');
    }

    return recommendations;
  }

  async runSpecificSuite(suiteName: string): Promise<void> {
    const suite = this.testSuites.find(s => s.name === suiteName);
    if (!suite) {
      console.error(`Test suite "${suiteName}" not found`);
      return;
    }

    await this.runTestSuite(suite);
    this.generateReport();
  }

  listAvailableSuites(): void {
    console.log('Available Admin Panel Test Suites:');
    console.log('==================================');
    this.testSuites.forEach(suite => {
      console.log(`${suite.name}: ${suite.description}`);
    });
  }
}

if (require.main === module) {
  const runner = new AdminQualityAssuranceRunner();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    runner.runAllTests();
  } else if (args[0] === 'list') {
    runner.listAvailableSuites();
  } else {
    runner.runSpecificSuite(args[0]);
  }
}