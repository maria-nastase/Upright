//
//  User.swift
//  Upright Hackwestern
//
//  Created by Yang Li on 2024-12-01.
//

import Foundation

struct User: Codable {
    let fname: String
    let lname: String
    let severity: String
    let number: String
    let longitude: Double
    let latitude: Double
}