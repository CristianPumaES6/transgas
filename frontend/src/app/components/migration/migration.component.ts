
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { SpeedAnalysisService } from '../../services/speed-analysis.service';
import { LoadingService } from '../../services/loading.service';
import { User } from '../../models/user';
import { Voyage } from '../../models/voyage';
import { Port } from '../../models/port';
import { DailyReport } from '../../models/daily-report';

@Component({
    selector: 'app-migration',
    templateUrl: './migration.component.html',
    styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {

    public status: string = 'Initializing...';
    public progress: number = 0;

    constructor(
        private router: Router,
        private databaseService: DatabaseService,
        private speedAnalysisService: SpeedAnalysisService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.startMigration();
    }

    async startMigration() {
        this.status = 'Loading local data...';
        this.progress = 10;

        try {
            // 1. Get Users
            this.status = 'Fetching Users...';
            const users: User[] = await this.databaseService.getUsersIndexDB() || [];
            this.progress = 30;

            // 2. Get Voyages
            this.status = 'Fetching Voyages...';
            const voyages: Voyage[] = await this.databaseService.getVoyagesIndexDB() || [];
            this.progress = 50;

            // 3. Get Ports
            this.status = 'Fetching Ports...';
            const ports: Port[] = await this.databaseService.getPortsIndexDB() || [];
            this.progress = 70;

            // 4. Get Daily Reports
            this.status = 'Fetching Daily Reports...';
            const dailyReports: DailyReport[] = await this.databaseService.getReportDailysIndexDB() || [];
            this.progress = 90;

            // 5. Export
            this.status = 'Generating Export File...';
            await this.speedAnalysisService.DowloadFullDbExport(users, voyages, ports, dailyReports);

            this.progress = 100;
            this.status = 'Export Completed Successfully.';

            // Optional: Redirect back after a delay? Or stay here?
            // For now, let's just stay or provide a button to go back.

        } catch (error) {
            console.error('Migration Error:', error);
            this.status = 'Error during migration. Please check console.';
        }
    }

    goBack() {
        this.router.navigate(['/application/dashboard']);
    }
}
