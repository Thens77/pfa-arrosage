package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.Grandeur;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Grandeur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrandeurRepository extends JpaRepository<Grandeur, Long> {
	@Query("select g from Grandeur g where g.zone.id =?1")
	List<Grandeur> getByZone(Long id);
}
