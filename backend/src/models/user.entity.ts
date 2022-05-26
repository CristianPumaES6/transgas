import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    imo: string;

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

    // Los años lo pongo ocmo string pero es un arreglo de numeros.
    @Column({ default: '' })
    years: string;



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
    @Column({ default: false })
    isConsumptionVLSFO: boolean;
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
    // --------------PERFORMANCE MGO-------------------------------

    // Cofiguracion de consumo de navegacion por contrato.
    @Column({ default: 0 })
    contractSpeedSailingBallastMGO: number;
    @Column({ default: 0 })
    contractSpeedSailingLadenMGO: number;
    @Column({ default: 0 })
    contractSpeedSailingEconomicalMGO: number;

    // Consumo por contrato
    @Column({ default: 0 })
    loadingConsumptionMGO: number;
    @Column({ default: 0 })
    dischargeConsumptionMGO: number;
    @Column({ default: 0 })
    sailingBallastConsumptionMGO: number;
    @Column({ default: 0 })
    sailingLoadConsumptionMGO: number;
    @Column({ default: 0 })
    sailingEconomicConsumptionMGO: number;
    @Column({ default: 0 })
    anchoredConsumptionMGO: number;
    @Column({ default: 0 })
    maneuverConsumptionMGO: number;
    @Column({ default: 0 })
    otherConsumptionMGO: number;

    //Performance IFO
    // Cofiguracion de consumo de navegacion por contrato.
    @Column({ default: 0 })
    contractSpeedSailingBallastIFO: number;
    @Column({ default: 0 })
    contractSpeedSailingLadenIFO: number;
    @Column({ default: 0 })
    contractSpeedSailingEconomicalIFO: number;

    // Consumo por contrato
    @Column({ default: 0 })
    loadingConsumptionIFO: number;
    @Column({ default: 0 })
    dischargeConsumptionIFO: number;
    @Column({ default: 0 })
    sailingBallastConsumptionIFO: number;
    @Column({ default: 0 })
    sailingLoadConsumptionIFO: number;
    @Column({ default: 0 })
    sailingEconomicConsumptionIFO: number;
    @Column({ default: 0 })
    anchoredConsumptionIFO: number;
    @Column({ default: 0 })
    maneuverConsumptionIFO: number;
    @Column({ default: 0 })
    otherConsumptionIFO: number;

    // Configuracion DASHBOARD
    @Column({ default: true })
    isDisplayLSFOConsumption: boolean;
    @Column({ default: true })
    isDisplayMGOConsumption: boolean;
    @Column({ default: true })
    isDisplayAverageSpeed: boolean;
    @Column({ default: true })
    isDisplayDataMGO: boolean;
    @Column({ default: true })
    isDisplayDataLSFO: boolean;
    @Column({ default: true })
    isDisplayVesselPerformanceLSFO: boolean;
    @Column({ default: true })
    isDisplayVesselPerformanceMGO: boolean;


    @Column()
    consumptionEquipmentME_MGO: number;
    @Column()
    consumptionEquipmentAE_MGO: number;
    @Column()
    consumptionEquipmentBOILER_MGO: number;
    @Column()
    consumptionEquipmentIG_MGO: number;
    @Column()
    consumptionEquipmentPP_MGO: number;
    @Column()
    consumptionEquipmentOther_MGO: number;

    @Column()
    consumptionEquipmentME_IFO: number;
    @Column()
    consumptionEquipmentAE_IFO: number;
    @Column()
    consumptionEquipmentBOILER_IFO: number;
    @Column()
    consumptionEquipmentOther_IFO: number;



    // Auditoria
    @Column()
    userIdCreated: number;
    @Column()
    dateCreated: string;

    @Column({ nullable: true })
    userIdUpdated: number;
    @Column({ nullable: true })
    dateUpdated: string;

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


        years?:string,

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

        // Performance MGO
        contractSpeedSailingBallastMGO?: number,
        contractSpeedSailingLadenMGO?: number,
        contractSpeedSailingEconomicalMGO?: number,
        loadingConsumptionMGO?: number,
        dischargeConsumptionMGO?: number,
        sailingBallastConsumptionMGO?: number,
        sailingLoadConsumptionMGO?: number,
        sailingEconomicConsumptionMGO?: number,
        anchoredConsumptionMGO?: number,
        maneuverConsumptionMGO?: number,
        otherConsumptionMGO?: number,

        // Performance IFO
        contractSpeedSailingBallastIFO?: number,
        contractSpeedSailingLadenIFO?: number,
        contractSpeedSailingEconomicalIFO?: number,
        loadingConsumptionIFO?: number,
        dischargeConsumptionIFO?: number,
        sailingBallastConsumptionIFO?: number,
        sailingLoadConsumptionIFO?: number,
        sailingEconomicConsumptionIFO?: number,
        anchoredConsumptionIFO?: number,
        maneuverConsumptionIFO?: number,
        otherConsumptionIFO?: number,


        // Display Dashboard
        isDisplayLSFOConsumption?: boolean,
        isDisplayMGOConsumption?: boolean,
        isDisplayAverageSpeed?: boolean,
        isDisplayDataMGO?: boolean,
        isDisplayDataLSFO?: boolean,
        isDisplayVesselPerformanceLSFO?: boolean,
        isDisplayVesselPerformanceMGO?: boolean,



        consumptionEquipmentME_MGO?: number,
        consumptionEquipmentAE_MGO?: number,
        consumptionEquipmentBOILER_MGO?: number,
        consumptionEquipmentIG_MGO?: number,
        consumptionEquipmentPP_MGO?: number,
        consumptionEquipmentOther_MGO?: number,
        consumptionEquipmentME_IFO?: number,
        consumptionEquipmentAE_IFO?: number,
        consumptionEquipmentBOILER_IFO?: number,
        consumptionEquipmentOther_IFO?: number,


        // Auditoria
        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,
        status?: boolean,
    ) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.filename = filename || '';
        this.password = password || '';
        this.language = language || '';
        this.role = role || '';

        this.years = years || '';

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

        // Performance MGO
        this.contractSpeedSailingBallastMGO = contractSpeedSailingBallastMGO || 0;
        this.contractSpeedSailingLadenMGO = contractSpeedSailingLadenMGO || 0;
        this.contractSpeedSailingEconomicalMGO = contractSpeedSailingEconomicalMGO || 0;
        this.loadingConsumptionMGO = loadingConsumptionMGO || 0;
        this.dischargeConsumptionMGO = dischargeConsumptionMGO || 0;
        this.sailingBallastConsumptionMGO = sailingBallastConsumptionMGO || 0;
        this.sailingLoadConsumptionMGO = sailingLoadConsumptionMGO || 0;
        this.sailingEconomicConsumptionMGO = sailingEconomicConsumptionMGO || 0;
        this.anchoredConsumptionMGO = anchoredConsumptionMGO || 0;
        this.maneuverConsumptionMGO = maneuverConsumptionMGO || 0;
        this.otherConsumptionMGO = otherConsumptionMGO || 0;

        // Performance IFO
        this.contractSpeedSailingBallastIFO = contractSpeedSailingBallastIFO || 0;
        this.contractSpeedSailingLadenIFO = contractSpeedSailingLadenIFO || 0;
        this.contractSpeedSailingEconomicalIFO = contractSpeedSailingEconomicalIFO || 0;
        this.loadingConsumptionIFO = loadingConsumptionIFO || 0;
        this.dischargeConsumptionIFO = dischargeConsumptionIFO || 0;
        this.sailingBallastConsumptionIFO = sailingBallastConsumptionIFO || 0;
        this.sailingLoadConsumptionIFO = sailingLoadConsumptionIFO || 0;
        this.sailingEconomicConsumptionIFO = sailingEconomicConsumptionIFO || 0;
        this.anchoredConsumptionIFO = anchoredConsumptionIFO || 0;
        this.maneuverConsumptionIFO = maneuverConsumptionIFO || 0;
        this.otherConsumptionIFO = otherConsumptionIFO || 0;


        // Display Dashboard
        this.isDisplayLSFOConsumption = isDisplayLSFOConsumption || false;
        this.isDisplayMGOConsumption = isDisplayMGOConsumption || false;
        this.isDisplayAverageSpeed = isDisplayAverageSpeed || false;
        this.isDisplayDataMGO = isDisplayDataMGO || false;
        this.isDisplayDataLSFO = isDisplayDataLSFO || false;
        this.isDisplayVesselPerformanceLSFO = isDisplayVesselPerformanceLSFO || false;
        this.isDisplayVesselPerformanceMGO = isDisplayVesselPerformanceMGO || false;

        // Conusmo por equipo.
        this.consumptionEquipmentME_MGO = consumptionEquipmentME_MGO || 0;
        this.consumptionEquipmentAE_MGO = consumptionEquipmentAE_MGO || 0;
        this.consumptionEquipmentBOILER_MGO = consumptionEquipmentBOILER_MGO || 0;
        this.consumptionEquipmentIG_MGO = consumptionEquipmentIG_MGO || 0;
        this.consumptionEquipmentPP_MGO = consumptionEquipmentPP_MGO || 0;
        this.consumptionEquipmentOther_MGO = consumptionEquipmentOther_MGO || 0;
        this.consumptionEquipmentME_IFO = consumptionEquipmentME_IFO || 0;
        this.consumptionEquipmentAE_IFO = consumptionEquipmentAE_IFO || 0;
        this.consumptionEquipmentBOILER_IFO = consumptionEquipmentBOILER_IFO || 0;
        this.consumptionEquipmentOther_IFO = consumptionEquipmentOther_IFO || 0;

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }


}
