import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('UserDetail')
export class UserDetailEntity {


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

}
