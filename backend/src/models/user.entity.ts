import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('User')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nick: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    filename: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: false })
    role: string;



    // CONFIG DE DATOS PARA EL CUADRO DEL DASHBOARD

    // Velocidad minima
    @Column({ default: 0 })
    minSpeed: number;
    // Velocidad maxima
    @Column({ default: 0 })
    maxSpeed: number;

    // El Buque usa este tipo de combustible?
    @Column({ default: true })
    isConsumptionIFO: boolean;
    @Column({ default: true })
    isConsumptionLSFO: boolean;
    @Column({ default: true })
    isConsumptionMGO: boolean;

    // Maximo de consumo para los cuadros de los dashboard.
    @Column({ default: 0 })
    maxIFOConsumption: number;
    @Column({ default: 0 })
    maxMGOConsumption: number;
    @Column({ default: 0 })
    minIFOConsumption: number;
    @Column({ default: 0 })
    minMGOConsumption: number;


    // EQUIPMENT MGO 
    @Column({ default: true })
    isMEMGO: boolean;
    @Column({ default: true })
    isAEMGO: boolean;
    @Column({ default: true })
    isBoilerMGO: boolean;
    @Column({ default: true })
    isIGMGO: boolean;
    @Column({ default: true })
    isPowerPMGO: boolean;
    @Column({ default: true })
    isOtherMGO: boolean;

    // EQUIPMENT IFO
    @Column({ default: true })
    isMEIFO: boolean;
    @Column({ default: true })
    isAEIFO: boolean;
    @Column({ default: true })
    isBoilerIFO: boolean;
    @Column({ default: true })
    isOtherIFO: boolean;

    // ---------------------------------------------
    // ---------------------------------------------

    // Cofiguracion de consumo de navegacion por contrato.
    @Column({ default: 0 })
    contractSpeedSailingBallast: number;
    @Column({ default: 0 })
    contractSpeedSailingLaden: number;
    @Column({ default: 0 })
    contractSpeedSailingEconomical: number;

    // Consumo por contrato
    @Column({ default: 0 })
    loadingConsumption: number;
    @Column({ default: 0 })
    dischargeConsumption: number;
    @Column({ default: 0 })
    sailingBallastConsumption: number;
    @Column({ default: 0 })
    sailingLoadConsumption: number;
    @Column({ default: 0 })
    sailingEconomicConsumption: number;
    @Column({ default: 0 })
    anchoredConsumption: number;
    @Column({ default: 0 })
    maneuverConsumption: number;
    @Column({ default: 0 })
    otherConsumption: number;


    @Column({ nullable: false })
    status: boolean;

    constructor(
        id?: number,
        nick?: string,
        name?: string,
        filename?: string,
        password?: string,
        language?: string,
        role?: string,

        minSpeed?: number,
        maxSpeed?: number,
        isConsumptionIFO?: boolean,
        isConsumptionLSFO?: boolean,
        isConsumptionMGO?: boolean,
        maxIFOConsumption?: number,
        maxMGOConsumption?: number,
        minIFOConsumption?: number,
        minMGOConsumption?: number,
        isMEMGO?: boolean,
        isAEMGO?: boolean,
        isBoilerMGO?: boolean,
        isIGMGO?: boolean,
        isPowerPMGO?: boolean,
        isOtherMGO?: boolean,
        isMEIFO?: boolean,
        isAEIFO?: boolean,
        isBoilerIFO?: boolean,
        isOtherIFO?: boolean,
        contractSpeedSailingBallast?: number,
        contractSpeedSailingLaden?: number,
        contractSpeedSailingEconomical?: number,
        loadingConsumption?: number,
        dischargeConsumption?: number,
        sailingBallastConsumption?: number,
        sailingLoadConsumption?: number,
        sailingEconomicConsumption?: number,
        anchoredConsumption?: number,
        maneuverConsumption?: number,
        otherConsumption?: number,

        status?: boolean,
    ) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.filename = filename || '';
        this.password = password || '';
        this.language = language || '';
        this.role = role || '';


        this.minSpeed = minSpeed || 0;
        this.maxSpeed = maxSpeed || 0;
        this.isConsumptionIFO = isConsumptionIFO || false;
        this.isConsumptionLSFO = isConsumptionLSFO || false;
        this.isConsumptionMGO = isConsumptionMGO || false;
        this.maxIFOConsumption = maxIFOConsumption || 0;
        this.maxMGOConsumption = maxMGOConsumption || 0;
        this.minIFOConsumption = minIFOConsumption || 0;
        this.minMGOConsumption = minMGOConsumption || 0;
        this.isMEMGO = isMEMGO || false;
        this.isAEMGO = isAEMGO || false;
        this.isBoilerMGO = isBoilerMGO || false;
        this.isIGMGO = isIGMGO || false;
        this.isPowerPMGO = isPowerPMGO || false;
        this.isOtherMGO = isOtherMGO || false;
        this.isMEIFO = isMEIFO || false;
        this.isAEIFO = isAEIFO || false;
        this.isBoilerIFO = isBoilerIFO || false;
        this.isOtherIFO = isOtherIFO || false;
        this.contractSpeedSailingBallast = contractSpeedSailingBallast || 0;
        this.contractSpeedSailingLaden = contractSpeedSailingLaden || 0;
        this.contractSpeedSailingEconomical = contractSpeedSailingEconomical || 0;
        this.loadingConsumption = loadingConsumption || 0;
        this.dischargeConsumption = dischargeConsumption || 0;
        this.sailingBallastConsumption = sailingBallastConsumption || 0;
        this.sailingLoadConsumption = sailingLoadConsumption || 0;
        this.sailingEconomicConsumption = sailingEconomicConsumption || 0;
        this.anchoredConsumption = anchoredConsumption || 0;
        this.maneuverConsumption = maneuverConsumption || 0;
        this.otherConsumption = otherConsumption || 0;

        this.status = status || false;
    }


}
